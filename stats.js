import { getAllServers, getAllHackableServers, getStats } from "serverInfo.js";
import { millisHR, moneyHR } from "utils.js";

/**
 * Auto-completes server names when the tab key is pressed.
 * This function is used by the game itself, not manually.
 * 
 * @param {Object} data Contains the key elements
 *                 "servers" (list of all servers),
 *                 "txts" (list of all text files),
 *                 "scripts" (list of all ".js" files), and 
 *                 "flags" (the ns.flags function);
 * @param {string[]} args The current arguments (without "run <scriptname>.js")
 * @return {string[]} All elements that are to be auto-completed (in this case all servers)
 */
export function autocomplete(data, args) {
	return [...data.servers];
}

/** @param {NS} ns */
export async function main(ns) {
	var arg0 = ns.args.length ? ns.args[0].toLowerCase() : "hackable";
	var servers = arg0 == "all" ? getAllServers(ns) :
		arg0 == "hackable" ? getAllHackableServers(ns) :
		ns.args;
	printStats(ns, servers);
}

/**
 * Converts server stats for one server into a summarizing string and returns it.
 * 
 * @param {{hostname:string,maxMoney:number,minSecurity:number,hackTime:number}} stats
 *        The server stats that are to be converted to a string
 * @return {string} a summarizing string of the server stats
 */
function toString(stats) {
	return stats["hostname"]
		+ ` -- maxMoney: ${moneyHR(stats["maxMoney"])}`
		+ `, minSecurity: ${stats["minSecurity"]}`
		+ `, hackTime: ${millisHR(stats["hackTime"])}`;
}

/**
 * Gathers and prints stats for a given group of servers.
 * 
 * @param {NS} ns It's everywhere
 * @param {string[]} servers The group of servers whose stats are to be printed
 */
export function printStats(ns, servers) {
	/* Concatenating a string over and over and printing the whole string at once
	is significantly faster (~10x as fast on node CLI) than printing each line
	one by one. */
	let stats = getStats(ns, servers);
	// for loop with indices is faster than for...of loop and even faster than map
	for (let i = 0; i < stats.length; i++) {
		stats[i] = toString(stats[i]);
	}
	ns.tprint(stats.join("\n"));
}