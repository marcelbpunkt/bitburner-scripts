import { getRootAccess } from "getRootAccess.js";
import { getAllServers, getAllHackableServers, getAvailableRam } from "serverInfo.js";
import { tryExec } from "utils.js";
import { AUTO_WEAKEN_SCRIPT, HOME_RAM_RESERVE, MAX_HACK_THREADS } from "constants.js";

const HACK_SIMPLE_SCRIPT = "hackSimple.js";

/** @param {NS} ns */
export async function main(ns) {
	const allServers = getAllServers(ns, false, false);
	for (const server of allServers) {
		ns.scriptKill(HACK_SIMPLE_SCRIPT, server);
		ns.scriptKill(AUTO_WEAKEN_SCRIPT, server);
	}
	const targets = getAllHackableServers(ns)
		.filter(target => ns.getServerMaxMoney(target) > 0)
		.sort((a, b) => ns.getServerMaxMoney(b) - ns.getServerMaxMoney(a));
	const scriptRam = ns.getScriptRam(HACK_SIMPLE_SCRIPT);
	const homeRam = ns.getServerMaxRam("home");
	const homeRamReserve = homeRam < 128 ? 0 : Math.min(HOME_RAM_RESERVE, homeRam / 4);
	let availableRam = getAvailableRam(ns, "home") - homeRamReserve;
	let numThreads = Math.min(MAX_HACK_THREADS, Math.floor(availableRam / scriptRam));
	while (targets.length && scriptRam * numThreads <= availableRam) {
		tryHack(ns, "home", numThreads, targets.shift());
		availableRam -= scriptRam * numThreads;
	}

	const pservs = ns.getPurchasedServers();
	while (pservs.length && targets.length) {
		const pserv = pservs.shift();
		availableRam = getAvailableRam(ns, pserv);
		numThreads = Math.min(MAX_HACK_THREADS, Math.floor(availableRam / scriptRam));
		while (targets.length && scriptRam * numThreads <= availableRam) {
			tryHack(ns, pserv, numThreads, targets.shift());
			availableRam -= scriptRam * numThreads;
		}
	}

	const otherServers = getAllServers(ns, true, true);
	if (!targets.length) return;

	const target = targets.shift();
	for (let server of otherServers) {
		availableRam = getAvailableRam(ns, server);
		if (availableRam < scriptRam) continue;

		numThreads = Math.min(MAX_HACK_THREADS, Math.floor(availableRam / scriptRam));
		tryHack(ns, server, numThreads, target);
	}
}

/**
 * @param {NS} ns
 * @param {string} server
 * @param {number} numThreads
 * @param {string} target
 */
function tryHack(ns, server, numThreads, target) {
	if (!getRootAccess(ns, server)) {
		ns.print(`Cannot get root access to host ${server}. Skiping.`);
		return;
	}
	if (!getRootAccess(ns, target)) {
		ns.print(`Cannot get root access to hack target ${target}. Skipping.`);
		return;
	}

	if (!tryExec(ns, HACK_SIMPLE_SCRIPT, server, numThreads, target)) {
		ns.print(`Something went wrong while trying to hack ${target} from ${server}.`);
		ns.exit();
	}
}