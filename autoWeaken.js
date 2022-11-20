/** @param {NS} ns */
export async function main(ns) {
	const target = ns.args.shift();
	const impactStock = ns.args.length ?
		String(ns.args.shift()).toLowerCase() == "true" :
		false;
	const opts = { stock: impactStock };
	while (true) {
		await ns.weaken(target, opts);
	}
}