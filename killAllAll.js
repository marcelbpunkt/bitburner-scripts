import { getAllServers } from "serverInfo.js";

/** @param {NS} ns */
export async function main(ns) {
	for (let server of getAllServers(ns, false, false)) {
		ns.killall(server, true);
	}
}