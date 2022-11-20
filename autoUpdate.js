import { UPDATE_SCRIPT } from "scriptNames.js";

/** @param {NS} ns */
export async function main(ns) {
	const naptime = ns.args.length ? parseInt(ns.args[0]) : 3600000
	while (true) {
		ns.exec(UPDATE_SCRIPT, "home");
		await(ns.sleep(naptime));
	}
}