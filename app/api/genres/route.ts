import axios from "axios";
import * as cheerio from "cheerio";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const response = await axios.get("http://books.toscrape.com/");
    const data = response.data;
    const $ = cheerio.load(data);

    const genres: any = [];

    $(".nav-list li > a").each((index, element) => {
      const genreName = $(element).text().trim();
      const genreLink = $(element).attr("href");
      genres.push({ name: genreName, link: genreLink });
    });

    console.log("Fetched genres:", genres);

    return NextResponse.json({ genres });
  } catch (error) {
    console.error("Error fetching genres:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
