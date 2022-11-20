/** @param {NS} ns */
export async function main(ns) {
	var rep = parseInt(ns.args[0]);
	ns.tprint(`${rep} reputation -> ${repToFavor(rep)} favor`);
}

/**
 * Calculates the amount of favor from reputation.
 * 
 * @param {number} rep The reputation
 * @return {number} The favor based on the reputation
 */
export function repToFavor(rep) {
	return 1 + Math.floor(Math.log((rep + 25000) / 25500) / Math.log(1.02));
}