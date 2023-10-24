import axios from "axios";
import * as cheerio from "cheerio";
import { NextResponse } from "next/server";

export async function GET(req: any) {
  try {
    console.log(req.query);
    const genreLink = req.query.genreLink;
    const minPrice = parseFloat(req.query.minPrice || "0");
    const maxPrice = parseFloat(req.query.maxPrice || "10000"); // Assuming a large max if not provided

    const response = await axios.get(`http://books.toscrape.com/${genreLink}`);
    const data = response.data;
    const $ = cheerio.load(data);

    const books: any = [];

    $("article.product_pod").each((index, element) => {
      const title = $(element).find('h3 a').attr('title');
      const priceStr = $(element).find('p.price_color').text();
      const price = parseFloat(priceStr.slice(1));

      if (price >= minPrice && price <= maxPrice) {
        books.push({ title, price });
      }
    });

    return NextResponse.json({ books });
  } catch (error) {
    console.log(error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

