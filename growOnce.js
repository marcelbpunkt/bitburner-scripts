/**
 * Grows a specified target server once. The number of threads must be
 * specified either via command line argument or the ns.exec function.
 * The first command line argument is the hostname of the target that
 * is to be grown (mandatory). The second argument is the time to
 * wait before growing the target in milliseconds (optional).
 * 
 * @param {NS} ns It's everywhere
 */
export async function main(ns) {
	if (!ns.args.length) {
		ns.print("Missing argument: hack target!");
		return;
	}

	if (ns.args.length > 1 && parseInt(ns.args[1]) > 0) {
		await ns.sleep(ns.args[1]);
	}
	
	await ns.grow(ns.args[0]);
}