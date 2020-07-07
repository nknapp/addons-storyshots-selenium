import { downloadChisel } from "chisel-tunnel";
import { ChildService } from "child-service";

export async function reverseTunnel({ host, tunnelSpec }) {
	const chiselExecutable = await downloadChisel("^1.6.0");

	return new ChildService({
		command: chiselExecutable,
		args: ["client", host + ":2222", tunnelSpec],
		readyRegex: / Connected /,
		listenOnStderr: true,
	});
}
