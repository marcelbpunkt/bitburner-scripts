import * as gc from "/gang/gangConstants.js";

/** @param {NS} ns */
export async function main(ns) {
	let gangInfo = ns.gang.getGangInformation();
	const isHackGang = gangInfo.isHacking;
	ns.print(`Starting gang management for ${gangInfo.faction} `
		+ `(${isHackGang ? "hacking" : "combat"} gang).`);
	const otherGangs = ns.gang.getOtherGangInformation();
	
	while (true) {
		// We need to update the member list continuously since it's possible
		// that a member dies while assigned to territory warfare.
		const members = getCanonicalMemberNames(ns);
		
		
		while (ns.gang.canRecruitMember()) {
			const newMember = createAndInsertNewMember(ns, members);
			if (!ns.gang.recruitMember(newMember)) {
				ns.print(`Could not recruit new member ${newMember} for some reason.`
					+ ` Aborting recruitment.`);
				break;
			}
			ns.gang.setMemberTask(newMember, gc.TASKS.train[+isHackGang]);
			augmentMember(ns, newMember, isHackGang);
		}

		for (let member of members) {
			if (!member) continue;

			if (isReadyToAscend(ns, member, isHackGang)) {
				ns.gang.ascendMember(member);
			}
			if (canFinishTraining(ns, member, isHackGang)) {
				// don't do this in training because too expensive!
				augmentMember(ns, member, isHackGang);
				if (member === getFirstMember(members)) {
					ns.gang.setMemberTask(member, gc.TASKS.wanted[+isHackGang]);
				} else {
					const task = getMemberCount(members) === gc.MAX_MEMBERS ?
						gc.TASKS.money[+isHackGang] :
						gc.TASKS.respect[+isHackGang];
					ns.gang.setMemberTask(member, task);
				}
				// If we've had enough money to fully augment a gang member,
				// we most likely also have the money to fully equip them.
				if (hasAllRelevantAugmentations(ns, member, isHackGang)) {
					equipMember(ns, member, isHackGang);
				}

			}
		}

		if (!isHackGang) {
			manageTerritory(ns);
		}

		await ns.sleep(gc.CYCLE_SLEEP_MILLIS);
	}
}

/**
 * Returns an array of size gc.MAX_MEMBERS with the names of all members
 * where the first one or two characters of a member equal their index
 * in the array.
 * 
 * @param {NS} ns It's everywhere
 * @return {string[]} The list of all current member names
 */
function getCanonicalMemberNames(ns) {
	const names = ns.gang.getMemberNames();
	const namesCanonical = new Array(gc.MAX_MEMBERS).fill(null);
	const numLength = gc.MAX_MEMBERS.toString().length;
	for (let name of names) {
		const idx = parseInt(name.substr(0, numLength).trim());
		namesCanonical[idx] = name;
	}

	return namesCanonical;
}

/**
 * Returns the first non-null member name of a specified canonical
 * member name array.
 * 
 * @param {string[]} members The canonical member name array as
 *        returned by getCanonicalMemberNames
 * @param {string} The first member name of the array that is not null
 */
function getFirstMember(members) {
	for (let member of members) {
		if (!member) continue;

		return member;
	}
}

/**
 * Returns the number of members, i.e. the number of elements of a
 * specified canonical member name array that are not null.
 * 
 * @param {string[]} members The canonical member name array as
 *        returned by getCanonicalMemberNames
 * @return {number} The number of names in the array that are not null
 */
function getMemberCount(members) {
	let notNull = 0;
	for (let member of members) {
		notNull += +!!member;
	}

	return notNull;
}

/**
 * Creates and returns a new member name (well... more like a designation)
 * and inserts it at the right index of a specified canonical member name
 * array.
 * 
 * @param {NS} ns It's everywhere
 * @param {string[]} members The canonical member name array as returned by
 *        getCanonicalMemberNames
 * @return {string} The name of the new member; the name will also be inserted
 *         into the members array
 */
function createAndInsertNewMember(ns, members) {
	for (let i = 0; i < members.length; i++) {
		if (members[i]) continue;

		const newMemberName = i + gc.MEMBER_SUFFIX;
		members[i] = newMemberName;

		return newMemberName;
	}

	throw `New member name could not be created. The gang is full!`;
}

/**
 * Determines and returns if a specified member is ready to ascend, i.e.
 * if their stat multipliers after the ascension are sufficiently higher
 * than before the ascension (as defined in ASCEND_AT_MULTIPLIERS).
 * 
 * @param {NS} ns It's everywhere
 * @param {string} member The name of the member
 * @param {boolean} isHacking true if the current gang is a hacking gang,
 *                  false if it is a combat gang
 * @return {boolean} true if the specified member will sufficiently increase
 *                   their stats by ascending, false otherwise
 */
function isReadyToAscend(ns, member, isHacking) {
	const asc = ns.gang.getAscensionResult(member);
	// asc is undefined if an ascension is impossible
	if (!asc) return false;
	const after = isHacking ?
		asc.hack :
		(asc.str + asc.def + asc.dex + asc.agi) / 4;
	
	return after >= gc.ASCEND_MULTIPLIER_DELTA;
}

/**
 * Determines if a specified member is ready to switch from training to
 * "productive" tasks (money/respect/wanted/territory).
 * 
 * @param {NS} ns It's everywhere
 * @param {string} member The name of the member
 * @param {boolean} isHackGang true if we are in a hacking gang,
 *        false if we are in a combat gang
 * @return {boolean} true if the member's stat multipliers have exceeded
 *         the training threshold and their task is still set to training,
 *         false otherwise
 */
function canFinishTraining(ns, member, isHackGang) {
	const stats = ns.gang.getMemberInformation(member);
	const multiplier = isHackGang ?
		stats.hack_asc_mult :
		(stats.str_asc_mult + stats.def_asc_mult +
			stats.dex_asc_mult + stats.agi_asc_mult) / 4;
	
	return multiplier >= gc.FINISH_TRAINING_MULTIPLIER &&
			gc.TASKS.train[+isHackGang] === stats.task;
}

/**
 * Tries to equip a specified member with either rootkits or
 * weapons, armor and vehicles, depending on whether we are
 * in a hacking or a combat gang.
 * 
 * @param {NS} ns It's everywhere
 * @param {string} member The name of the member to equip
 * @param {boolean} isHacking true if we are in a hacking gang,
 *                  false if we are in a combat gang
 */
function equipMember(ns, member, isHacking) {
	const memberInfo = ns.gang.getMemberInformation(member);
	for (let equipment of gc.EQUIPMENTS[+isHacking]) {
		if (!memberInfo.upgrades.includes(equipment)) {
			const cost = ns.gang.getEquipmentCost(equipment);
			if (ns.getPlayer().money >= cost) {
				ns.gang.purchaseEquipment(member, equipment);
			}
		}
	} 
}

/**
 * Tries to install augmentations in a specified member. The kinds of
 * augmentations depend on whether we are in a hacking or a combat gang.
 * 
 * @param {NS} ns It's everywhere
 * @param {string} member The name of the member to augment
 * @param {boolean} isHackGang true if we are in a hacking gang,
 *                  false if we are in a combat gang
 */
function augmentMember(ns, member, isHackGang) {
	const memberInfo = ns.gang.getMemberInformation(member);
	for (let aug of gc.AUGMENTATIONS[+isHackGang]) {
		if (!memberInfo.augmentations.includes(aug)) {
			const cost = ns.gang.getEquipmentCost(aug);
			if (ns.getPlayer().money >= cost) {
				ns.gang.purchaseEquipment(member, aug);
			}
		}
	} 
}

/**
 * Checks if a specified member has all relevant augmentations installed.
 * 
 * @param {NS} ns It's everywhere
 * @param {string} member The name of the member to check
 * @param {boolean} isHackGang true if we are in a hacking gang,
 *                  false if we are in a combat gang
 * @return {boolean} true if the member has all relevant (i.e. either hacking
 *         or combat) augmentations installed, false otherwise
 */
function hasAllRelevantAugmentations(ns, member, isHackGang) {
	const memberInfo = ns.gang.getMemberInformation(member);
	for (let aug of gc.AUGMENTATIONS[+isHackGang]) {
		if (!memberInfo.augmentations.includes(aug)) return false;
	}

	return true;
}

/**
 * Checks if a specified member has all relevant equipment.
 * 
 * @param {NS} ns It's everywhere
 * @param {string} member The name of the member to check
 * @param {boolean} isHackGang true if we are in a hacking gang,
 *                  false if we are in a combat gang
 * @return {boolean} true if the member has all relevant (i.e. either hacking
 *         or combat) equipment, false otherwise
 */
function hasAllRelevantEquipment(ns, member, isHackGang) {
	const memberInfo = ns.gang.getMemberInformation(member);
	for (let eq of gc.EQUIPMENTS[+isHackGang]) {
		if (!memberInfo.upgrades.includes(eq)) return false;
	}

	return true;
}

/**
 * Checks if a specified member has all combat augmentations, all weapons,
 * armor and vehicles.
 * 
 * @param {NS} ns It's everywhere
 * @param {string} member the name of the member to check
 */
function isArmedToTheTeeth(ns, member) {
	return hasAllRelevantAugmentations(ns, member, false)
		&& hasAllRelevantEquipment(ns, member, false);
}

/**
 * Manages the gang's territory. This method operates under the assumption
 * that the current gang is a combat gang.
 * When all members are fully augmented and fully equipped, the own
 * territory is less than 100%, all members will be assigned the task
 * "Territory Warfare". And as soon as the clash win chance against ALL
 * other gangs is above gc.MIN_CLASH_WIN_CHANCE,
 * "engage in territory warfare" is enabled.
 * 
 * @param {NS} ns It's everywhere
 */
function manageTerritory(ns) {
	const members = ns.gang.getMemberNames();

	////////// CASE 1: gang is not ready for battle yet //////////
	for (let member of members) {
		if (!isArmedToTheTeeth(ns, member)) return;
	}

	////////// CASE 2: the battle is over //////////
	const gangInfo = ns.gang.getGangInformation();
	// gangInfo.territory is a decimal value, not a percentage!
	if (gangInfo.territory === 1) {
		gainMoney(ns, false);

		return;
	}

	////////// CASE 3: prepare for battle //////////
	const minClashWinChance = Infinity;
	for (otherGang of Object.keys(ns.gang.getOtherGangInformation())) {
		if (otherGang === ns.gang.getGangInformation().faction) continue;
		
		const clashWinChance = ns.gang.getChanceToWinClash(otherGang);
		if (clashWinChance < minClashWinChance) minClashWinChance = clashWinChance;
	}
	if (minClashWinChance < gc.MIN_CLASH_WIN_CHANCE) {
		// build up gang power but don't engage in actual gang wars yet
		ns.gang.setTerritoryWarfare(false);
		gainPower(ns);

		return;
	////////// CASE 4: have at them!!! //////////
	} else {
		ns.gang.setTerritoryWarfare(true);
	}
}

/**
 * Sets all members' tasks to the one with the highest money gain,
 * except for the first member who will decrease the gang's wanted
 * level.
 * 
 * @param {NS} ns It's everywhere
 * @param {boolean} isHackGang true if we are in a hacking gang,
 *        false if we are in a combat gang
 */
function gainMoney(ns, isHackGang) {
	const members = ns.gang.getMemberNames();
	for (const member of members) {
		const task = member === members[0] ?
			gc.TASKS.wanted[+isHackGang] :
			gc.TASKS.money[+isHackGang];
	}
}

/**
 * Sets all members' tasks to "Territory Warfare". This method
 * assumes that we are in a combat gang.
 * 
 * @param {NS} ns It's everywhere
 */
function gainPower(ns) {
	for (const member of ns.gang.getMemberNames()) {
		ns.gang.setMemberTask(member, "Territory Warfare");
	}
}