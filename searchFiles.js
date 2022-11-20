import { getAllServers } from "getServers.js";

/** @param {NS} ns */
export async function main(ns) {
	for (var server of getAllServers(ns)) {
		var files = listFilesFromServer(ns, server);
		if (files.length) {
			ns.tprint(`${server}:`);
			for (var file of files) {
				ns.tprint(`    ${file}`);
			}
		}
	}
}

/**
 * Searches a specified server for any files, except a specified list of ignored files, and returns them.
 * 
 * @param {NS} ns It's everywhere
 * @param {string} server The server that is to be ls'ed
 * @param {string[]} ignored A list of files that are ignored in the search (default: ["hack.js"])
 * @return {string} All files from the specified server except those that are ignored, separated by ",";
 *                  must not contain whitespaces
 */
function listFilesFromServer(ns, server, ignored = "hack.js") {
	var aIgnored = ignored.split(",");
	return ns.ls(server).filter(filename => !aIgnored.includes(filename)).sort();
}