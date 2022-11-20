import { getAllHackableServers } from "serverInfo.js";
import { HackData } from "HackData.js";
import { HACK_DATA_DIR } from "constants.js";

/** @param {NS} ns It's everywhere */
export async function main(ns) {
	autoHackBatch(ns);
}

/**
 * Continuously hacks the highest-ranking targets using batches
 * (well-timed scripts that finish milliseconds after one another).
 * 
 * @param {NS} ns It's everywhere
 */
function autoHackBatch(ns) {
	if (!ns.fileExists("Formulas.exe", "home")) {
		throw "Cannot find Formulas.exe!";
	}

	const targets = getAllHackableServers(ns);
	let host = "home";

}

/**
 * Tries to load hack data for a specified target from disk.
 * If the respective file does not exist yet, the data will be computed
 * and cached in a file afterwards.
 * 
 * @param {NS} ns It's everywhere
 * @param {string} target The hostname of the target
 * @return {HackData} The hack data for the target
 */
function loadHackData(ns, target) {
	const jsonFile = `${HACK_DATA_DIR}/${target}.json`;
	if (ns.fileExists(jsonFile)) {
		return JSON.parse(ns.read(jsonFile));
	}

	const hackData = fromFormulas(ns, target);
	saveHackData(ns, hackData);

	return hackData;
}

/**
 * @param {NS} ns It's everywhere
 * @param {HackData} hackData the data to save
 */
function saveHackData(ns, hackData) {
	const jsonFile = `${HACK_DATA_DIR}/${target}.json`;
	ns.write(jsonFile, JSON.stringify(hackData), "w");
}

/**
 * Calculates and returns the hack data of a specified target
 * by means of the Formulas API. Note that Formulas.exe must
 * be present on the home computer for this reason.
 * 
 * @param {NS} ns It's everywhere
 * @param {string} target The hostname of the target
 * @return {HackData} The hack data of the target
 */
function fromFormulas(ns, target) {
	const hackData = new HackData()
}

/**
 * @param {NS} ns It's everywhere
 * @param {string} target The target to prepare
 */
function prepareTarget(ns, target) {
	const targetServer = ns.getServer(target);
	const player = ns.getPlayer();
	player.exp.
	const weakenTime1 = ns.formulas.hacking.weakenTime(targetServer);
}

/**
 * @param {NS} ns It's everywhere
 * @param {HackData} hackData Contains all necessary information for the hack target
 */
function hackBatch(ns, hackData) {
	
}