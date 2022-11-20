import { AUTO_SOLVE_SCRIPTS, AUTO_SOLVE_HOST } from "constants.js";
import { deployScripts } from "utils.js";
import { getRootAccess } from "getRootAccess.js";

/** @param {NS} ns */
export async function main(ns) {
	if (!getRootAccess(ns, AUTO_SOLVE_HOST)) return;

	ns.scriptKill(AUTO_SOLVE_SCRIPTS[0], AUTO_SOLVE_HOST);
	if (deployScripts(ns, AUTO_SOLVE_SCRIPTS, AUTO_SOLVE_HOST)) {
		ns.print(`Successfully deployed auto-solve scripts.`);
	} else {
		ns.print(`Something went wrong while deploying auto-solve scripts!`);
	}
}