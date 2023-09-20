import { NextRequest, NextResponse } from "next/server";
import { parse9gagTitles } from "../services/9gagScrapeService";
import { capture } from "../services/9gagScrapeService";

export async function GET(req: NextRequest) {
  try {
    const url = req.nextUrl;
    const headers = req.headers;

    console.log("Server: maxResults is ", url.searchParams.get("maxResults"));
    console.log("Server: section is ", url.searchParams.get("section"));

    const maxResults = url.searchParams.get("maxResults");
    const section = url.searchParams.get("section") || "";
    const sourcePage = headers.get("sourcePage");

    let titles;
    if (sourcePage === "9gagScraper") {
      titles = await parse9gagTitles(maxResults, section);
    } else if (sourcePage === "9gagScraperV2") {
      titles = await capture(maxResults, section);
    } else {
      throw new Error("Invalid sourcePage parameter");
    }

    console.log("Server: Sending titles:", titles);

    return new NextResponse(JSON.stringify({ titles }), {
      status: 200,
    });
  } catch (error) {
    console.log("Server: Error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
