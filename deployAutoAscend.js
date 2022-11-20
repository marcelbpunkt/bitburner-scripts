import { AUTO_ASCEND_SCRIPTS, AUTO_ASCEND_HOST } from "constants.js";
import { deployScripts } from "utils.js";
import { getRootAccess } from "getRootAccess.js";

/** @param {NS} ns */
export async function main(ns) {
	if (!getRootAccess(ns, AUTO_ASCEND_HOST)) return;

	ns.scriptKill(AUTO_ASCEND_SCRIPTS[0], AUTO_ASCEND_HOST);
	if (deployScripts(ns, AUTO_ASCEND_SCRIPTS, AUTO_ASCEND_HOST)) {
		ns.print(`Successfully deployed auto-ascend scripts.`);
	} else {
		ns.print(`Something went wrong while deploying auto-ascend scripts!`);
	}
}