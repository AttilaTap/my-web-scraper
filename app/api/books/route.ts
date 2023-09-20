import axios from "axios";
import * as cheerio from "cheerio";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const response = await axios.get("http://books.toscrape.com/");
    const data = response.data;
    const $ = cheerio.load(data);

    const prices: string[] = [];

    $("p.price_color").each((index, element) => {
      if (index >= 25) {
        return false; // Break out of the loop
      }
      const price = $(element).text();
      if (price) {
        // Only add if the text exists
        console.log(`Element ${index + 1}: ${price}`); // Log each element
        prices.push(price);
      }
    });

    console.log("All Prices:", prices);

    return NextResponse.json({ prices }); // Return a NextResponse object
  } catch (error) {
    console.log(error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
