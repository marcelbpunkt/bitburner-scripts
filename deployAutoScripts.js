import {
	AUTO_SOLVE_SCRIPTS,
	AUTO_SOLVE_HOST,
	AUTO_ASCEND_SCRIPTS,
	AUTO_ASCEND_HOST
} from "constants.js";
import { deployScripts } from "utils.js";
import { getAllServers } from "serverInfo.js";

/** @param {NS} ns It's everywhere */
export async function main(ns) {
	let pid = ns.exec("getRootAccess.js", "home");
	while (ns.isRunning(pid)) await ns.sleep(100);
	killAllScripts(ns);
	deployAutoAscend(ns);
	deployAutoSolve(ns);
	autoHackSimple(ns);
}

/**
 * Can't be imported or executed by "killAllAll.js" since it
 * would kill this script, even with the safeguard flag set.
 * 
 * @param {NS} ns It's everywhere
 * @return {boolean} true if any scripts were killed,
 *         false otherwise
 */
function killAllScripts(ns) {
	let retval = false;
	for (let server of getAllServers(ns, false, false)) {
		// Important: killall must be the first OR operand or the
		// condition will short-cirtuit if retval is already true.
		retval = ns.killall(server, true) || retval;
	}

	return retval;
}

/**
 * Deploys and starts the auto-ascend scripts.
 * 
 * @param {NS} ns It's everywhere
 * @return {boolean} true if the scripts were successfully copied and the
 *         first script was successfully started,
 *         false otherwise
 */
function deployAutoAscend(ns) {
	return deployScripts(ns, AUTO_ASCEND_SCRIPTS, AUTO_ASCEND_HOST);
}

/**
 * Deploys and starts the auto-solve scripts.
 * 
 * @param {NS} ns It's everywhere
 * @return {boolean} true if the scripts were successfully copied and the
 *         first script was successfully started,
 *         false otherwise
 */
function deployAutoSolve(ns) {
	return deployScripts(ns, AUTO_SOLVE_SCRIPTS, AUTO_SOLVE_HOST);
}

/**
 * Starts autoHackSimple.js on "home".
 * 
 * @param {NS} ns It's everywhere
 * @return {boolean} true if the script was successfully started,
 *         false otherwise
 */
function autoHackSimple(ns) {
	return !!ns.exec("autoHackSimple.js", "home");
}