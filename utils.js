/**
 * Tries to execute a speficied script on a specified host. If the
 * host is not "home", the script will be scp'ed there beforehand
 * overwriting a potentially already existing file.
 * 
 * @param {NS} ns It's everywhere
 * @param {string} filename The filename of the script to run
 * @param {string} host The name of the host on which to run the script
 * @param {number} numThreads The number of threads used for the execution
 *                 (default = 1)
 * @param {(string | number | boolean)[]} args The command line
 *                                        arguments passed on to the script
 * @return {number} The PID of the running script, or 0 if it could not
 *                  be started
 */
export function tryExec(ns, filename, host, numThreads = 1, ...args) {
	if (host != "home") {
		ns.scp(filename, host, "home");
	}
	
	const pid = ns.exec(filename, host, numThreads, ...args);
	if (!pid) {
		ns.print(`Script ${filename} could not be started on ${host}!`);
	}

	return pid;
}

/**
 * Deploys a specified list of scripts to a specified host
 * and executes the first of these scripts on said host.
 * Note that the deployed scripts must not require any arguments
 * to run since they are ignored entirely.
 * 
 * @param {NS} ns It's everywhere
 * @param {string[]} scripts The filenames of the scripts to deploy
 * @param {string} host The name of the host to which the scripts are deployed
 * @return {boolean} true if the scripts were successfully copied and the
 *         first script was successfully started,
 *         false otherwise
 */
export function deployScripts(ns, scripts, host) {
	return !!ns.scp(scripts, host) && !!ns.exec(scripts[0], host);
}

/**
 * Converts a given amount of money (or a quantity in general) to a
 * human-readable format (k, m, b etc.).
 * 
 * @param {number} money The amount that is to be human-readablized
 * @return {string} The human-readable version of money, or null on error
 */
export function moneyHR(money) {
	if (money < 1000 || money.toString().toLowerCase().includes("e")) {
		return money.toString();
	}

	// "kilo" (1000), million, billion, trillion, quadrillion, quintillion
	// Anything >= 100Q will be represented in e-notation.
	const units = ["k", "m", "b", "t", "q", "Q"];
	let moneyDiv = money;
	for (let i = 0; i < units.length; i++) {
		moneyDiv /= 1000;
		if (moneyDiv < 1000) {
			return moneyDiv.toFixed(3) + units[i];
		}
	}

	console.log(`Something went wrong in moneyHR (money = ${money})!`);
	return null;
}

/**
 * Converts milliseconds into a human-readable format (days, hours, minutes, seconds, millis).
 * 
 * @param {number} millis The milliseconds that are to be human-readablized
 * @return {string} The human-readable version of millis
 */
export function millisHR(millis) {
	const secs = Math.round(millis) / 1000;
	const fields = [
		Math.floor(secs / 86400),
		Math.floor(secs / 3600) % 24,
		Math.floor(secs / 60) % 60,
		(secs % 60)
	];
	
	let humanReadable = fields[0] > 0 ? fields[0] + "d" : "";
	humanReadable += fields[1] > 0 ? fields[1] + "h" : "";
	humanReadable += fields[2] > 0 ? fields[2] + "m" : "";
	// sometimes weird rounding errors happen so let's fix it again to 3 decimals
	humanReadable += fields[3] > 0 ? fields[3].toFixed(3) + "s" : "";

	return humanReadable;
}

/**
 * Converts a specified amount of gigabytes into a human-readable format using
 * GB, TB, PB, and EB, YB, and BB units (division by 1000, not 1024!).
 * 
 * @param {number} gigabytes The amount of RAM in GB
 * @return {string} A human-readable format of the specified amount of RAM
 *                  (e.g. ramHR(1024) === "1.02TB")
 */
export function ramHR(gigabytes) {
	const units = ["GB", "TB", "PB", "EB", "ZB", "YB", "BB"];
	const exp = gigabytes || Math.floor(Math.log(gigabytes) / Math.log(1000))
	if (exp >= units.length) {
		throw "Ok, someone has really got a god complex if "
			+ "not even brontobytes are enough to measure their amount of RAM!";
	}

	return Math.round(gigabytes / Math.pow(1000, exp) * 100) / 100 + units[exp];
}