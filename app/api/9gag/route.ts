import { NextRequest, NextResponse } from "next/server";
import { parse9gagTitles} from "../services/9gagTitleService";
import { capture } from "../services/9gagScreenCapService";

export async function GET(req: NextRequest) {
  try {
    const url = req.nextUrl;
    const headers = req.headers;
    const maxResults = parseInt(url.searchParams.get("maxResults") || "0", 10);
    const section = url.searchParams.get("section") || "";
    const sourcePage = headers.get("sourcePage");

    if (sourcePage === "9gagScraper") {
      const titles = await parse9gagTitles(maxResults, section);
      console.log("Server: Sending titles:", titles);
      return new NextResponse(JSON.stringify({ titles }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    } else if (sourcePage === "9gagScraperV2") {
      const imagesPromises = Array.from({ length: maxResults }, (_, i) => capture(i, section));
      const images = await Promise.all(imagesPromises);
      const base64Images = images.map((image) => image.toString("base64"));
      console.log("Server: Sending images");
      return new NextResponse(JSON.stringify({ images: base64Images }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    } else {
      throw new Error("Invalid sourcePage parameter");
    }
  } catch (error) {
    console.log("Server: Error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
