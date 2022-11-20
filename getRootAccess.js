import { getAllServers, getNumPortsAccessible } from "serverInfo.js";

/**
 * Executable for the getRootAccess function.
 * Takes the hostname of the target as the only command line argument.
 * All further command line arguments are ignored.
 * @param {NS} ns It's everywhere.
 */
export async function main(ns) {
	var targets = ns.args.length ? ns.args : getAllServers(ns);
	for (let target of targets) {
		ns.print(getRootAccess(ns, target) ?
			`Root access to ${target} established.` :
			`Could not (yet) get root access on ${target}!`);
	}
}

/**
 * Tries to gain root access on a given server.
 * 
 * @param {NS} ns it's everywhere
 * @param {string} target The hostname of the server on which to get root access
 * @return {boolean} true if root access could be gained or already exists on the target server,
 *                   false otherwise
 */
export function getRootAccess(ns, target) {
	
	if (ns.hasRootAccess(target)) {
		ns.print(`Root access on ${target} already exists.`);
		return true;
	}

	const numPortsExpected = ns.getServerNumPortsRequired(target);
	const numPortsActual = getNumPortsAccessible(ns);
	if (numPortsActual < numPortsExpected) {
		ns.print(`Root access not yet available on ${target}.`);
		return false;
	}

	const openPort = [
		ns.brutessh,
		ns.ftpcrack,
		ns.relaysmtp,
		ns.httpworm,
		ns.sqlinject
	];
	
	for (let i = 0; i < numPortsExpected; i++) {
		openPort[i](target);
	}
	ns.nuke(target);

	ns.print(`Root access established on ${target}.`);
	return true;
}