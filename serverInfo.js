import { OPEN_PORT_BINARIES } from "constants.js";

/* Note: not intended for command line use. Create separate scripts
for that purpose. */

/**
 * Returns the amount of available RAM for a specified server.
 * 
 * @param {NS} ns It's everywhere
 * @param {string} server The hostname of the server
 * @return {number} The amount of available RAM on the server in GB
 */
export function getAvailableRam(ns, server) {
	return ns.getServerMaxRam(server) - ns.getServerUsedRam(server);
}

/**
 * Determines the highest possible number of threads with which a
 * specified script can run on a specified host.
 * 
 * @param {NS} ns It's everywhere
 * @param {string} script The name of the script to run
 * @param {string} host The nahe of the host on which to run the script
 * @return {number} The highest possible number of threads that the
 *         script can run with on the specified host
 */
export function getMaxThreads(ns, script, host) {
	const ramAvailable = getAvailableRam(ns, host);
	const scriptRam = ns.getScriptRam(script);
	return Math.floor(ramAvailable / scriptRam);
}

/**
 * Returns the number of ports that can be opened at this time.
 * The order of the ports is always SSH, FTP, SMTP, HTTP, SQL. As soon as any of the ports
 * cannot be opened, the function will return the number of accessible ports SO FAR!
 * For example, if the SSH and SQL port can be opened, the function will still only return 1.
 * 
 * @param {NS} ns It's everywhere.
 * @return {number} The number of accessible ports as described above
 */
export function getNumPortsAccessible(ns) {
	var numPorts = 0;
	for (var exe of OPEN_PORT_BINARIES) {
		if (!ns.fileExists(exe, "home")) break;
		numPorts++;
	}

	return numPorts;
}

/**
 * Performs a Breadth-First Search in order to find all available servers
 * and returns their hostnames. The home server and darkweb are always
 * excluded, purchased servers are excluded by default but can be included.
 * 
 * @param {NS} ns It's everywhere
 * @param {boolean} ignoreHome If true, the home server will be
 *                  ignored in the search (default = true)
 * @param {boolean} ignorePurchased If true, all purchased servers will be
 *                  ignored in the search (default = true)
 * @return {string[]} An array containing the hostnames of all available servers
 *                    except home, darkweb, and, if ignorePurchased is true, all
 *                    purchased servers
 */
export function getAllServers(ns, ignoreHome = true, ignorePurchased = true) {
	const excluded = (ignoreHome ? ["home", "darkweb"] : ["darkweb"]).concat(
		ignorePurchased ? ns.getPurchasedServers() : []
	);
	let servers = ns.scan("home").filter(
		server => !excluded.includes(server)
	);
	for (var server of servers) {
		var adjUniqueServers = ns.scan(server).filter(
			server => !servers.includes(server)
			&& !excluded.includes(server)
		);
		if (adjUniqueServers.length) {
			for (var adjServer of adjUniqueServers) {
				servers.push(adjServer);
			}
		}
	}

	return servers;
}

/**
 * Performs a Breadth-First Search in order to find all available servers
 * and returns the hostname of all servers whose min. hack level is lower than the player's
 * hack skill. The home server, all purchased servers and darkweb are excluded.
 * 
 * @param {NS} ns It's everywhere
 * @return {string[]} An array containing the hostnames of all hackable servers
 *                    except home, all purchased servers, and darkweb
 */
export function getAllHackableServers(ns) {
	var playerHackLvl = ns.getHackingLevel();
	var numPortsAccessible = getNumPortsAccessible(ns);

	return getAllServers(ns, true, true).filter(
		server => numPortsAccessible >= ns.getServerNumPortsRequired(server)
			&& playerHackLvl >= ns.getServerRequiredHackingLevel(server)
	)
}

/**
 * Performs a Depth-First Search and returns the path between two given nodes.
 * 
 * @param {NS} ns It's everywhere
 * @param {string} target The hostname of the target node
 * @param {string} rootNode The hostname of the root node ("home" by default)
 * @param {string[]} visitedNodes An array of nodes that have already been visited
 * @return {string[]} An array containing the hostnames of all nodes that form
 *                    the path from the root node to the target node (root node
 *                    excluded, target node included). If no such path exists,
 *                    the root and target nodes are identical, or the root node has
 *                    already been visited, an empty array will be returned.
 */
export function getPathToServer(ns, target, rootNode = "home", visitedNodes = []) {
	if (visitedNodes.includes(rootNode)) {
		ns.print(`Error: ${rootNode} has already been visited!`);
		return [];
	}
	
	// mark current node as visited in order to avoid endless recursion
	// (delete/comment this out if you want the while(true) achievement :P)
	visitedNodes.push(rootNode);

	// this shouldn't happen but just in case someone (or some script)
	// runs this function with identical root and target nodes
	if (target === rootNode) return [];

	const adjNodes = ns.scan(rootNode).filter(node => !visitedNodes.includes(node));

	// dead end
	if (!adjNodes.length) return [];

	// target is adjacent to this node
	if (adjNodes.includes(target)) return [target];

	// target is not adjacent to this node -> next recursion step
	for (var node of adjNodes) {
		var pathFromHere = getPathToServer(ns, target, node, visitedNodes);
		if (pathFromHere.length) {
			// path to target found
			return [node].concat(pathFromHere);
		}
		// else do nothing and continue to next node since we hit a dead end
	}

	// there's no path to target from here
	return [];
}

/**
 * Gets and returns the max. money, min. security level, and hack time stats
 * for a specified group of servers.
 * 
 * @param {NS} ns It's everywhere
 * @param {string[]} servers The servers for which the stats are to be returned
 * @return {{hostname:string,maxMoney:number,minSecurity:number,hackTime:number}[]}
 *         The server stats, each of which consists of the keys "hostname",
 *         "maxMoney", "minSecurity" and "hackTime", sorted by maxMoney in
 *         descending order
 */
export function getStats(ns, servers) {
	if (!servers.length) return [];

	var stats = []
	for (var server of servers) {
		stats.push({
			"hostname": server,
			"maxMoney": ns.getServerMaxMoney(server),
			"minSecurity": ns.getServerMinSecurityLevel(server),
			"hackTime": ns.getHackTime(server),
		});
	}
	stats.sort((a, b) => b["maxMoney"] - a["maxMoney"]);

	return stats;
}