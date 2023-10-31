import puppeteer, { Browser, Page } from "puppeteer";

/**
 * Wait for a specified amount of time.
 *
 * @param ms - Time in milliseconds to wait.
 * @returns - Promise that resolves after the specified time.
 */
async function wait(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Click on the accept button if it appears on the page.
 *
 * @param page - The page instance from puppeteer.
 */
async function clickAcceptButton(page: Page): Promise<void> {
  try {
    const ACCEPT_BUTTON_SELECTOR = "#onetrust-accept-btn-handler";
    const acceptButton = await page.waitForSelector(ACCEPT_BUTTON_SELECTOR, { timeout: 5000 });

    if (acceptButton) {
      await acceptButton.click();
      console.log("Clicked on the privacy policy acceptance button.");

      await wait(1000);

      const acceptButtonAgain = await page.$(ACCEPT_BUTTON_SELECTOR);
      if (acceptButtonAgain) {
        await acceptButtonAgain.click();
      }
    }
  } catch (error) {
    console.error("Error while trying to click on the privacy policy acceptance button.", error);
  }
}

/**
 * Capture a screenshot of a 9GAG section.
 *
 * @param maxResults - Maximum number of sections to scroll through.
 * @param section - The section of 9GAG to capture.
 * @returns - Promise resolving with the screenshot Buffer.
 */
export async function capture(maxResults: number, section: string): Promise<Buffer> {
  const url = `https://9gag.com/${section}`;
  let browser: Browser | null = null;

  try {
    console.log("Launching the browser...");
    browser = await puppeteer.launch({ headless: "new" });

    const page = await browser.newPage();
    await page.setViewport({ width: 1024, height: 768 });

    console.log(`Navigating to ${url}...`);
    await page.goto(url, { waitUntil: "networkidle0" });

    await clickAcceptButton(page);

    const bodyHeight = await page.evaluate(() => document.body.scrollHeight);
    console.log(`Page height is ${bodyHeight}px.`);

    const viewportHeight: number = page.viewport()?.height ?? 768;
    const scrollSteps = Math.ceil(bodyHeight / viewportHeight);

    for (let currentStep = 0; currentStep < scrollSteps && currentStep < maxResults; currentStep++) {
      console.log(`Scrolling the page by ${viewportHeight}px...`);
      await page.evaluate((_viewportHeight: number) => {
        window.scrollBy(0, _viewportHeight);
      }, viewportHeight);

      await wait(3000);
    }

    const screenshot = await page.screenshot({ type: "png" });
    console.log("Screenshot taken.");

    return screenshot;
  } catch (error) {
    console.error("An unexpected error occurred:", error);
    throw error;
  } finally {
    if (browser) {
      await browser.close();
      console.log("Browser closed.");
    }
  }
}
