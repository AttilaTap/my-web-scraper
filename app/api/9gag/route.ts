import { NextRequest, NextResponse } from "next/server";
import { parse9gagTitles } from "../services/9gagScrapeService";

export async function GET(req: NextRequest) {
  try {
    const url = req.nextUrl;

    console.log("Server: maxResults is ", url.searchParams.get("maxResults"));

    const titles = await parse9gagTitles(url.searchParams.get("maxResults"));
    console.log("Server: Sending titles:", titles);

    return new NextResponse(JSON.stringify({ titles }), {
      status: 200,
    });
  } catch (error) {
    console.log("Server: Error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
