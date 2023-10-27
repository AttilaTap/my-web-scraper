import axios from "axios";
import * as cheerio from "cheerio";
import { NextResponse } from "next/server";

export async function GET(req: any) {
  try {
    // Extract searchParams from the URL
    const searchParams = new URL(req.url).searchParams;

    // Convert searchParams to an object
    const query: { [key: string]: string } = {};
    for (let [key, value] of searchParams.entries()) {
      query[key] = value;
    }

    console.log("Extracted Query:", query);

    const { genreLink, minPrice = "0", maxPrice = "10000" } = query;

    if (!genreLink) {
      console.error("Error: Missing genreLink in query");
      return new NextResponse(JSON.stringify({ error: "Bad Request", message: "Missing genreLink" }), { status: 400 });
    }

    const minPriceValue = parseFloat(minPrice);
    const maxPriceValue = parseFloat(maxPrice);

    const response = await axios.get(`http://books.toscrape.com/${genreLink}`);
    const data = response.data;
    const $ = cheerio.load(data);

    const books: any = [];

    $("article.product_pod").each((index, element) => {
      const title = $(element).find("h3 a").attr("title");
      const priceStr = $(element).find("p.price_color").text();
      const price = parseFloat(priceStr.slice(1));

      if (price >= minPriceValue && price <= maxPriceValue) {
        books.push({ title, price });
      }
    });

    return NextResponse.json({ books });
  } catch (error) {
    console.error("Error in /api/books:", error);
    if (error instanceof Error) {
        return new NextResponse(JSON.stringify({ error: "Internal Server Error", message: error.message }), { status: 500 });
    }
    return new NextResponse(JSON.stringify({ error: "Internal Server Error", message: "An unexpected error occurred" }), { status: 500 });
  }
}
