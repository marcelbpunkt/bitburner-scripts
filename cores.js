import { getAllHackableServers } from "serverInfo.js";

/** @param {NS} ns */
export async function main(ns) {
	for (let target of getAllHackableServers(ns)) {
		ns.tprint(`***** ${target} *****`)
		for (let i = 1; i <= 8; i++) {
			ns.tprint(`    ${i} cores -> ${ns.growthAnalyze(target, 2, i)}`);
		}
	}
}