/**
 * Standalone script for the ns.installBackdoor function.
 * Can only be run on the target server itself so it has to be scp'ed there beforehand,
 * preferably from another script by use of the backdoor method in this script.
 * All command line arguments are ignored.
 * 
 * @param {NS} ns It's everywhere.
 */
export async function main(ns) {
	ns.print(`Installing backdoor on ${ns.getServer().hostname}.`);
	installBackdoor();
}

/**
 * Installs a backdoor on a remote server by SCP'ing this
 * script to a specified server and executing it there.
 * Note: there is no guarantee or feedback if the backdoor
 * has actually successfully been installed on the remote
 * server. Hack level and root access checks must hence be
 * done beforehand.
 * 
 * @param {NS} ns It's everywhere
 * @param {string} server The hostname of the server where
 *                        the backdoor is to be installed
 */
export async function backdoor(ns, server) {
	var thisScript = ns.getScriptName();
	ns.scp(thisScript, server);
	var pid = ns.exec(thisScript, server);

	if (pid == 0) {
		ns.print(`Something went wrong while trying to install a backdoor on ${server}!`);
		return;
	}

	while (ns.isRunning(pid)) {
		await(ns.sleep(1000));
	}

	ns.print(`Backdoor installed on ${server}.`);
}