import initStoryshots from "@storybook/addon-storyshots";
import { reverseTunnel } from "./test-utils/reverse-tunnel";
import { imageSnapshot } from "../src/index";

// Storybook must already be running on port 9009
const remoteTunnelPort = 9009;
const storybookPort = 9009;

const tunnelPromise = reverseTunnel({
	host: process.env.SELENIUM_HOST || "localhost",
	tunnelSpec: `R:${remoteTunnelPort}:localhost:${storybookPort}`,
});

beforeAll(async () => (await tunnelPromise).start());
afterAll(async () => (await tunnelPromise).stop().catch(console.error));

initStoryshots({
	framework: "html",
	suite: "All",
	test: imageSnapshot({
		sizes: ["1280x1024", "1024x768", "800x600", "320x640"],
		browsers: [
			{
				id: "chrome",
				capabilities: {
					browserName: "chrome",
				},
			},
			{
				id: "firefox",
				capabilities: {
					browserName: "firefox",
				},
			},
		],
		storybookUrl: "http://localhost:9009",
		snapshotDirectory: __filename + "-snapshots",
	}),
});