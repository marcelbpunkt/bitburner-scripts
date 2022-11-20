import * as c from "constants.js";

export { State } from "HackDataState.js";

/**
 * Data class that contains all necessary analytic data for hack,
 * grow and weaken calls.
 */
export class HackData {
	/**
	 * The target state before and after hack, and before and
	 * after grow
	 */
	targetState;
	/**
	 * Number of threads necessary for hack, grow and weaken calls
	 */
	numThreads;
	/**
	 * Milliseconds to sleep before invoking grow and weaken calls
	 * (within one batch, hack calls are always invoked immediately)
	 */
	sleepMillis;
	/**
	 * Amount of RAM needed for hack, grow and weaken calls
	 */
	ramNeeded;
	/**
	 * The total time in milliseconds it takes to execute one batch
	 * (hack, weaken, grow, weaken)
	 */
	totalRuntime;
	/**
	 * Total amount of RAM needed for a whole batch
	 */
	totalRamNeeded;

	/**
	 * Initializes the hack data for a specified target.
	 * 
 	 * @param {NS} ns It's everywhere
 	 * @param {string} target The hostname of the hack target
 	 */
	constructor(ns, target) {
		for (let s in State) {
			this.#createServerObj(ns, s);
		}
	}

	/**
	 * Creates a Server object for a specified target and hack state,
	 * and stores it in this.targetState.
	 * 
	 * @param {NS} ns It's everywhere
	 * @param {string} target The hostname of the target
	 * @param {string} s The hack state of the target
	 */
	#createServerObj(ns, target, s) {
		const serverObj = ns.getServer(target);
		switch(s) {
			case State.BEFORE_HACK:
				serverObj.moneyAvailable = serverObj.moneyMax;
				serverObj.hackDifficulty = serverObj.minDifficulty;
				break;
			case State.AFTER_HACK:
				ns.hackAnalyzeThreads(target, 42)
				ns.formulas.hacking.hackPercent(this.targetState[State.BEFORE_HACK]);
				break;
			case State.BEFORE_GROW:
				break;
			case State.AFTER_GROW:
				break;
			default:
				throw `Illegal hack state: ${s}!`;
		}

		this.targetState[s] = serverObj;
	}

	/**
	 * Calculates the number of threads for hack, grow and weaken calls
	 * and stores the values in the respective members.
	 * 
	 * @param {NS} ns It's everywhere
	 */
	#calculateThreads(ns) {
	}

	/**
	 * Calculates the number of milliseconds to sleep before hack, grow
	 * and weaken calls, and stores the values in the respective members.
	 * 
	 * @param {NS} ns It's everywhere
	 */
	#calculateSleep(ns) {

	}
}