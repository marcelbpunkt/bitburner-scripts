import { getPathToServer } from "serverInfo.js";

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
	var target = ns.args[0];
	var rootNode = ns.args.length > 1 ? ns.args[1] : ns.getServer().hostname;
	var path = getPathToServer(ns, target, rootNode);
	
	ns.tprint(path.length ? path : `No path found from ${rootNode} to ${target}.`);
}