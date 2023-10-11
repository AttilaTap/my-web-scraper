import * as puppeteer from "puppeteer";

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

export async function capture(maxResults: number, section: string): Promise<Buffer> {
  const url = `https://9gag.com/${section}`;
  const browser = await puppeteer.launch({ headless: false });

  const page = await browser.newPage();
  await page.setViewport({ width: 1024, height: 768 });
  await page.goto(url, { waitUntil: "networkidle0" });

  const clickAcceptButton = async () => {
    try {
      const acceptButton = await page.waitForXPath('//button/span[text()="I ACCEPT"]', { timeout: 5000 });
      await (acceptButton as puppeteer.ElementHandle).click();
      console.log("Clicked on the cookie acceptance button.");

      await wait(1000);

      const acceptButtonAgain = await page.$x('//button/span[text()="I ACCEPT"]');
      if (acceptButtonAgain.length > 0) {
        await (acceptButtonAgain[0] as puppeteer.ElementHandle).click();
        console.log("Clicked on the cookie acceptance button again.");
      }
    } catch (error) {
      console.log("Error while trying to click on the cookie acceptance button.", error);
    }
  };

  await clickAcceptButton();

  const bodyHandle = await page.$("body");
  const boundingBox = await bodyHandle?.boundingBox();
  const height: number = boundingBox?.height || 0;
  await bodyHandle?.dispose();

  const viewportHeight: number = page.viewport()?.height ?? 900;
  let viewportIncr: number = 0;
  let numResults: number = 0;

  while (viewportIncr < height && numResults < maxResults) {
    await page.evaluate((_viewportHeight: number) => {
      window.scrollBy(0, _viewportHeight);
    }, viewportHeight);

    await wait(3000);

    viewportIncr += viewportHeight;
    numResults++;

    console.log(`Scrolled ${viewportIncr}px, taken ${numResults} screenshots so far.`);
  }

  const screenshot = await page.screenshot({ type: "png" });
  await browser.close();
  return screenshot;
}
