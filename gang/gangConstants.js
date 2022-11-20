/**
 * The default faction to which a new gang belongs
 */
export const DEFAULT_FACTION = "Slum Snakes";
/**
 * The maximum possible number of members in a gang
 */
export const MAX_MEMBERS = 12;
/**
 * The (hack or combat) stat multiplier delta at which a gang member
 * is to ascend, i.e. the member ascends as soon as the ascension result
 * exceeds the current stat multiplier * ASCEND_MULTIPLIER_DELTA
 */
export const ASCEND_MULTIPLIER_DELTA = 2;
/**
 * The stat multiplier at which a member is to switch from training to
 * respect/money/wanted/territory tasks
 */
export const FINISH_TRAINING_MULTIPLIER = ASCEND_MULTIPLIER_DELTA * 4;
/**
 * The minimum clash win chance against ALL other gangs at which
 * territory warfare engagement is enabled
 */
export const MIN_CLASH_WIN_CHANCE = 0.9;
/**
 * The number of milliseconds to sleep after each loop
 */
export const CYCLE_SLEEP_MILLIS = 20000;
/**
 * The suffix for all member names... I mean, designations.
 */
export const MEMBER_SUFFIX = " of 12";
/**
 * All equipment items for both hacking and combat gangs
 * (not including augmentations) where the index equals
 * the numeric value of
 * ns.gang.getGangInformation().isHacking
 */
export const EQUIPMENTS = Object.freeze([
	Object.freeze([
		// first weapon
		"AWM Sniper Rifle",
		// first armor
		"Graphene Plating Armor",
		// additional weapons
		"Baseball Bat",
		"Katana",
		"Glock 18C",
		"P90C",
		"Steyr AUG",
		"AK-47",
		"M15A10 Assault Rifle",
		// additional armor
		"Bulletproof Vest",
		"Full Body Armor",
		"Liquid Body Armor",
		// vehicles
		"Ford Flex V20",
		"ATX1070 Superbike",
		"Mercedes-Benz S9001",
		"White Ferrari"
	]),
	Object.freeze([
		"NUKE Rootkit",
		"Soulstealer Rootkit",
		"Demon Rootkit",
		"Hmap Node",
		"Jack the Ripper"
	])
]);
/**
 * All augmentations for both hacking and combat gangs
 * where the index equals the numeric value of
 * ns.gang.getGangInformation().isHacking
 */
export const AUGMENTATIONS = Object.freeze([
	Object.freeze([
		"Bionic Arms",
		"Bionic Legs",
		"Bionic Spine",
		"BrachiBlades",
		"Nanofiber Weave",
		"Synthetic Heart",
		"Synfibril Muscle",
		"Graphene Bone Lacings"
	]),
	Object.freeze([
		"BitWire",
		"Neuralstimulator",
		"DataJack"
	])
]);
/**
 * The tasks for all stages of both combat and hack gangs.
 * The idea is to decide first where to put the focus
 * ("train", "wanted", "respect", or "money" key value),
 * each of which represents an array whose index equals the
 * numeric value of ns.gang.getGangInformation().isHacking.
 */
export const TASKS = Object.freeze({
	train: Object.freeze(["Train Combat", "Train Hacking"]),
	wanted: Object.freeze(["Vigilante Justice", "Ethical Hacking"]),
	respect: Object.freeze(["Terrorism", "Cyberterrorism"]),
	money: Object.freeze(["Human Trafficking", "Money Laundering"])
});