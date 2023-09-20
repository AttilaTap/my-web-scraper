import puppeteer, { Browser, BoundingBox, Page } from "puppeteer";

export async function parse9gagTitles(maxResults: any, section: string) {
  let browser;
  try {
    // Debugging line: Log before launching the browser
    console.log("Service: Launching browser");

    browser = await puppeteer.launch({ headless: "new", protocolTimeout: 180000 });
    const page = await browser.newPage();

    // Debugging line: Log before navigating to the website
    const fullUrl = `https://9gag.com/${section}`;
    console.log(`Service: Navigating to 9GAG/${section}`);

    await page.goto(fullUrl, { waitUntil: "load" });
    await page.setViewport({
      width: 1080,
      height: 1024,
    });

    // Auto-scroll
    await autoScroll(page, maxResults);

    // Debugging line: Log before scraping the titles
    console.log("Service: Scraping titles");

    let titles = await page.$$eval("a h2[data-v-7f40ae1b]", (titleElements) => titleElements.map((title) => (title.textContent ? title.textContent.trim() : "")));
    titles = titles.filter(Boolean);

    titles = titles.slice(0, maxResults);

    // Debugging line: Log the scraped titles
    console.log("Service: Scraped titles:", titles);

    await browser.close();
    return titles;
  } catch (error) {
    // Debugging line: Log any caught error
    console.error("Service: An error occurred:", error);

    if (browser) {
      await browser.close();
    }
    throw error;
  }
}

async function autoScroll(page: any, maxResults: number) {
  await page.evaluate(async (maxResults: number) => {
    await new Promise<void>((resolve) => {
      let totalHeight = 0;
      let distance = 100;
      let timer = setInterval(() => {
        window.scrollBy(0, distance);
        totalHeight += distance;

        const numberOfTitles = document.querySelectorAll("a h2[data-v-7f40ae1b]").length;

        if (numberOfTitles >= maxResults) {
          clearInterval(timer);
          resolve();
        }
      }, 15);
    });
  }, maxResults);
}

//*************************************************************************************************************************************/

function wait(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(() => resolve(), ms));
}

export async function capture(maxResults: any, section: string): Promise<Buffer> {
  const url = `https://9gag.com/${section}`;
  const browser = await puppeteer.launch({ headless: "new", protocolTimeout: 180000 });

  // Load the specified page
  const page: Page = await browser.newPage();
  await page.goto(url, { waitUntil: "load" });

  // Get the height of the rendered page
  const bodyHandle = await page.$("body");
  const boundingBox: BoundingBox | null | undefined = await bodyHandle?.boundingBox();
  const height: number = boundingBox?.height || 0;
  await bodyHandle?.dispose();

  // Scroll one viewport at a time, pausing to let content load
  const viewportHeight: number = page.viewport()!.height;
  let viewportIncr: number = 0;
  while (viewportIncr + viewportHeight < height) {
    await page.evaluate((_viewportHeight: number) => {
      window.scrollBy(0, _viewportHeight);
    }, viewportHeight);
    await wait(20);
    viewportIncr += viewportHeight;
  }

  // Scroll back to top
  await page.evaluate(() => {
    window.scrollTo(0, 0);
  });

  // Some extra delay to let images load
  await wait(100);

  return await page.screenshot({ type: "png" });
}
