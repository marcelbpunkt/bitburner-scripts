/** @param {NS} ns */
export async function main(ns) {
	if (!ns.args.length) {
		ns.print("Missing argument: target");
		return;
	}

	const target = ns.args.shift();
	const minSecurity = ns.getServerMinSecurityLevel(target);
	const maxMoney = ns.getServerMaxMoney(target);

	while (true) {
		if (ns.getServerSecurityLevel(target) > minSecurity) {
			await ns.weaken(target);
		} else if (ns.getServerMoneyAvailable(target) < maxMoney) {
			await ns.grow(target);
		} else {
			await ns.hack(target);
		}
	}
}