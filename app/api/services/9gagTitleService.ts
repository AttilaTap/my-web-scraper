import * as puppeteer from "puppeteer";

export async function parse9gagTitles(maxResults: any, section: string) {
  let browser;
  try {
    browser = await puppeteer.launch({ headless: "new", protocolTimeout: 180000 });
    const page = await browser.newPage();

    const fullUrl = `https://9gag.com/${section}`;

    await page.goto(fullUrl, { waitUntil: "load" });
    await page.setViewport({
      width: 1080,
      height: 1024,
    });

    await autoScroll(page, maxResults);

    let titles = await page.$$eval("a h2[data-v-7f40ae1b]", (titleElements) => titleElements.map((title) => (title.textContent ? title.textContent.trim() : "")));
    titles = titles.filter(Boolean);

    titles = titles.slice(0, maxResults);

    await browser.close();
    return titles;
  } catch (error) {
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