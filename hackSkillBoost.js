import { getMaxThreads, getAllServers } from "serverInfo.js";
import { tryExec } from "utils.js";
import { AUTO_WEAKEN_SCRIPT } from "constants.js";

/** @param {NS} ns */
export async function main(ns) {
	const target = ns.args.length ? ns.args.shift() : "n00dles";
	const impactStock = ns.args.length ? ns.args.shift() : false;
	const allServers = getAllServers(ns, false, false);
	for (let server of allServers) {
		ns.scriptKill("hackSimple.js", server);
		ns.scriptKill(AUTO_WEAKEN_SCRIPT, server);
		const maxThreads = getMaxThreads(ns, AUTO_WEAKEN_SCRIPT, server);
		if (maxThreads === 0) {
			ns.print(`Not enough RAM on ${server} for ${AUTO_WEAKEN_SCRIPT}. Skipping.`);
			continue;
		}
		tryExec(ns, AUTO_WEAKEN_SCRIPT, server, maxThreads, target, impactStock);
	}
}