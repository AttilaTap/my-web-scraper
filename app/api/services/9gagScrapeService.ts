import puppeteer from "puppeteer";

export async function parse9gagTitles(maxResults: any) {
  let browser;
  try {
    // Debugging line: Log before launching the browser
    console.log("Service: Launching browser");

    browser = await puppeteer.launch({ headless: "new", protocolTimeout: 300000 });
    const page = await browser.newPage();

    // Debugging line: Log before navigating to the website
    console.log("Service: Navigating to 9GAG/trending");

    await page.goto("https://9gag.com/trending");
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
