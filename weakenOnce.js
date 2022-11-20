/**
 * Weakens a specified target server once. The number of threads must be
 * specified either via command line argument or the ns.exec function.
 * The first command line argument is the hostname of the target that
 * is to be weakened (mandatory). The second argument is the time to
 * wait before weakening the target in milliseconds (optional).
 * 
 * @param {NS} ns It's everywhere
 */
export async function main(ns) {
	if (!ns.args.length) {
		ns.print("Missing argument: hack target!");
		return;
	}

	const target = ns.args.shift();
	const sleepMillis = ns.args.length ? parseInt(ns.args.shift()) : 0;

	if (sleepMillis > 0) {
		await ns.sleep(sleepMillis);
	}
	
	await ns.weaken(target);
}