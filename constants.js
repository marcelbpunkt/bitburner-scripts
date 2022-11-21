/**
 * One second converted to milliseconds
 */
export const ONE_SECOND_MILLIS = 1000;
/**
 * One minute converted to milliseconds
 */
export const ONE_MINUTE_MILLIS = 60 * ONE_SECOND_MILLIS;
/**
 * One hour converted to milliseconds
 */
export const ONE_HOUR_MILLIS = 60 * ONE_MINUTE_MILLIS;
/**
 * One day converted to milliseconds
 */
export const ONE_DAY_MILLIS = 24 * ONE_HOUR_MILLIS;

/**
 * Filenames of all .exe files that can open ports on a target server.
 */
export const OPEN_PORT_BINARIES = [
	"BruteSSH.exe",
	"FTPCrack.exe",
	"relaySMTP.exe",
	"HTTPWorm.exe",
	"SQLInject.exe"
];

/**
 * The filename of the continuous batched hacking script
 */
export const AUTO_HACK_BATCH_SCRIPT = "autoHackBatch.js";
/**
 * The filename of the continuous simple hacking script
 */
export const AUTO_HACK_SIMPLE_SCRIPT = "autoHackSimple.js";
/**
 * The filename of the one-time hacking script
 */
export const HACK_ONCE_SCRIPT = "hackOnce.js";
/**
 * The filename of the one-time growing script
 */
export const GROW_ONCE_SCRIPT = "growOnce.js";
/**
 * The filename of the auto-weaken script
 */
export const AUTO_WEAKEN_SCRIPT = "autoWeaken.js";
/**
 * The filename of the one-time weaken script
 */
export const WEAKEN_ONCE_SCRIPT = "weakenOnce.js";
/**
 * The filename of the script that updates all servers
 * with the new optimal hack targets
 */
export const UPDATE_SCRIPT = "updateServers.js";
/**
 * The filename of the contract solver script
 */
export const CONTRACT_SOLVER_SCRIPT = "solveContracts.js";
/**
 * Auto-solve script and its dependencies
 */
export const AUTO_SOLVE_SCRIPTS = [
	"autoSolve.js",
	"solveContracts.js",
	"solvers.js",
	"serverInfo.js",
	"constants.js"
];
/**
 * The server on which to run the auto-solver script
 */
export const AUTO_SOLVE_HOST = "zer0";

/**
 * Auto-ascend script and its dependencies
 */
export const AUTO_ASCEND_SCRIPTS = [
	"/gang/autoGang.js",
	"/gang/gangConstants.js",
	"constants.js"
];
/**
 * The server on which to run the auto-ascend script
 */
export const AUTO_ASCEND_HOST = "silver-helix";

/**
 * The directory inside which all hack data is stored
 */
export const HACK_DATA_DIR = "hackData";

/**
 * The RAM reserve to keep free for manual script executions on home, in GiB.
 */
export const HOME_RAM_RESERVE = 1152; // 1 TiB for corporation API's + 128 GiB for misc scripts

/**
 * The amount of time in milliseconds between the termination of two
 * scripts where the second script uses the state changes of the first
 * (e.g. finishing hack() by SCRIPT_PIPELINE_DELAY ms after weaken())
 */
export const SCRIPT_PIPELINE_DELAY = ONE_SECOND_MILLIS;
/**
 * The multiplier of the max. amount of money available on a hack target.
 * We don't steal all the money so we can calculate the number of growth
 * threads more easily, don't have to deal with division by zero, don't
 * run out of RAM as fast etc.
 */
export const STEAL_MONEY_MULTIPLIER = 0.9;
/**
 * Hack thread cap in order to avoid "no server with enough RAM available"
 * situation
 */
export const MAX_HACK_THREADS = 10000;
/**
 * The amount by which the security level is decreased where
 * the index equals the amount of cores minus 1. Or, more formally:
 * WEAKEN_PER_THREAD[i - 1] === ns.weakenAnalyze(1, i) (for i in [1, 8]).
 * Note that, unlike the ns.weakenAnalyze function, this constant does
 * not use up any in-game RAM.
 */
export const WEAKEN_PER_THREAD = [
	0.05,
	0.053125,
	0.05625,
	0.059375,
	0.0625,
	0.065625,
	0.06875,
	0.071875
];
/**
 * The amount by which the security level grows per thread when growing
 * any hack target, no matter how many cores are used.
 */
export const GROW_SECURITY_PER_THREAD = 0.004;
/**
 * The amount by which the security level grows per thread when hacking
 * any target successfully, no matter how many cores are used.
 */
export const HACK_SECURITY_PER_THREAD = 0.002;