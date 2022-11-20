import { ONE_MINUTE_MILLIS } from "constants.js";
import { solveAllContracts } from "solveContracts.js";
import { getAllServers } from "serverInfo.js";

/** @param {NS} ns */
export async function main(ns) {
	const sleepTime = parseInt(ns.args[0]) || 10 * ONE_MINUTE_MILLIS;
	const allServers = getAllServers(ns, false, true);
	while (true) {
		solveAllContracts(ns, allServers);
		await ns.sleep(sleepTime);
	}
}