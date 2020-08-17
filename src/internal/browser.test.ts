import { Browser } from "./browser";
import { willBeInitialized } from "./test-utils/will-be-initialized";
import { By } from "selenium-webdriver";
import { toMatchImageSnapshot } from "jest-image-snapshot";

expect.extend({ toMatchImageSnapshot });

function htmlAsDataUrl(strings: TemplateStringsArray, ...substitutions: string[]) {
	const html = String.raw(strings, ...substitutions);
	const htmlAsBase64 = Buffer.from(html, "utf-8").toString("base64");
	return "data:text/html;base64," + htmlAsBase64;
}

let browser: Browser = willBeInitialized();

beforeAll(() => {
	browser = new Browser("http://localhost:24444/wd/hub", {
		id: "chrome",
		capabilities: {
			browserName: "chrome",
		},
	});
});

beforeEach(async () => {
	await browser.driver.switchTo().defaultContent();
	await browser.driver.get("about:blank");
	await browser.driver.manage().window().setRect({ x: 100, y: 100, width: 500, height: 500 });
});

afterAll(async () => {
	await browser.close();
});

describe("prepareBrowser", () => {
	it("opens a browser window and an iframe containing the webpage", async () => {
		const testPage = htmlAsDataUrl`<div>Web Page Contents</div>`;
		await browser.prepareBrowser(testPage);

		const iframe = await browser.driver.findElement(By.id("storyview"));
		await browser.driver.switchTo().frame(iframe);
		const body = await browser.driver.findElement(By.css("body"));
		expect(await body.getText()).toEqual("Web Page Contents");
	});
});

describe("resizeTo and takeScreenshot", () => {
	it("creates a screenshot of the storyview iframe of the given size", async () => {
		const testPage = htmlAsDataUrl`<style>
  html, body {
      padding: 0;
      margin: 0;
      width: 100%;
      height: 100%;
  }

  div {
      height: 100%;
      width: 100%;
      box-sizing: border-box;
      margin: 0;
      border: 2px solid green;
  }
</style>
<div>
</div>
`;
		await browser.prepareBrowser(testPage);
		await browser.resizeTo("50x50");
		const screenshot = await browser.takeScreenshot();
		expect(screenshot).toMatchImageSnapshot();
	}, 200000);
});