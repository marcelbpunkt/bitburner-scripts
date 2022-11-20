/** @param {NS} ns */
export async function main(ns) {
	var target = ns.args.shift();
	var executingServers = ns.args;

	for (var executingServer of executingServers) {
		ns.killall(executingServer);
		if (!ns.fileExists("hack.js", executingServer)) {
			ns.scp("hack.js", executingServer);
		}
		var numThreads = Math.floor((ns.getServerMaxRam(executingServer) - ns.getServerUsedRam(executingServer))
			/ ns.getScriptRam("hack.js"));
		var pid = ns.exec("hack.js", executingServer, numThreads, target);
		if (pid == 0) {
			ns.tprint(`[${executingServer}] Warning: hack.js could not be started!`);
		} else {
			ns.tprint(`[${executingServer}] hack.js started with target ${target} (t=${numThreads}).`)
		}
	}
}