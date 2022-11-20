import { moneyHR, ramHR } from "utils.js";

/**
 * Auto-completes commands when the tab key is pressed.
 * This function is used by the game itself, not manually.
 * 
 * @param {string[]} data Contains the key elements
 *                 "servers" (list of all servers),
 *                 "txts" (list of all text files),
 *                 "scripts" (list of all ".js" files), and 
 *                 "flags" (the ns.flags function);
 * @param {string[]} args The current arguments (without "run <scriptname>.js")
 * @return {string[]} All elements that are to be auto-completed (in this case all servers)
 */
export function autocomplete(data, args) {
	return [
		"cost",
		"delete",
		"delete-all",
		"purchase",
		"purchase-all",
		"upgrade",
		"upgrade-all",
		"list"];
}

/** @param {NS} ns */
export async function main(ns) {
	if (!ns.args.length) {
		ns.tprint("Missing command argument!");
		return;
	}
	var cmds = createPservCommands(ns);
	var cmd = ns.args.shift().toLowerCase();
	var arg = ns.args.length ? ns.args.shift() : undefined;
	ns.tprint(cmds[cmd](arg));
}

/**
 * Creates and returns a dictionary containing all commands.
 * 
 * @param {NS} ns It's everywhere
 * @return {Object} A dictionary containing all command names as keys
 *                  and their respective functions as values
 */
export function createPservCommands(ns) {
	return {
		// we need to "unbox" the argument from ns.args
		"cost": function(ram) {
			return moneyHR(ns.getPurchasedServerCost(checkRam(ns, ram)));
		},
		"delete": function(server) {
			ns.killall(server);
			return `Server deleted: ${ns.deleteServer(server) || "none"}`;
		},
		"delete-all": function(a) {
			var deleted = [];
			for (var pServ of ns.getPurchasedServers()) {
				ns.killall(pServ);
				if (ns.deleteServer(pServ)) deleted.push(pServ);
			}
			return `Servers deleted: ${deleted}`;
		},
		"purchase": function(ram) {
			return `Server purchased: ${ns.purchaseServer("pserv", checkRam(ns, ram)) || "none"}`;
		},
		"purchase-all": function(ram) {
			var limit = ns.getPurchasedServerLimit();
			var newServers = [];
			var cost = ns.getPurchasedServerCost(checkRam(ns, ram));
			while (ns.getPurchasedServers().length < limit && cost <= ns.getPlayer().money) {
				newServers.push(ns.purchaseServer("pserv", checkRam(ns, ram)));
			}
			return `Servers purchased: ${newServers.length ? newServers : "none"}`;
		},
		"upgrade": function(ram, pServer) {
			var ramBefore = ns.getServerMaxRam(pServer);
			var ramAfter = checkRam(ns, ram);
			var playerMoney = ns.getPlayer().money;
			var cost = ns.getPurchasedServerCost(ramAfter);

			if (ramAfter <= ramBefore) {
				return `Server ${pServer} not upgraded: already >= ${ramHR(ramAfter)} RAM installed.`;
			}
			if (cost > playerMoney) {
				return `Server ${pServer} could not be upgraded: not enough money.`;
			}

			ns.killall(pServer);
			ns.deleteServer(pServer);
			ns.purchaseServer(pServer, ram);
			return `Server upgraded: ${pServer} (${ramBefore} -> ${ramAfter})`;
		},
		"upgrade-all": function(ram) {
			var ramAfter = checkRam(ns, ram);
			var upgraded = [];
			for (var pServer of ns.getPurchasedServers()) {
				var playerMoney = ns.getPlayer().money;
				var cost = ns.getPurchasedServerCost(ramAfter);
				var ramBefore = ns.getServerMaxRam(pServer);
				if (ramAfter <= ramBefore || cost > playerMoney) continue;

				ns.killall(pServer);
				ns.deleteServer(pServer);
				ns.purchaseServer(pServer, ramAfter);
				upgraded.push(pServer);
			}

			return `Servers upgraded: ${upgraded.length ? upgraded : "none"}`
		},
		"list": function(a) {
			var owned = ns.getPurchasedServers();
			return `Servers owned: ${owned.length ? owned : "none"}`;
		}
	};
}

/**
 * Checks if ram equals "max" (case-insensitive) and, if so, returns the max amount of ram a
 * purchased server can have, or the oritinal value otherwise.
 * 
 * @param {NS} ns It's everywhere
 * @param {string} ram The amount of RAM that is to be checked
 * @return {number} The max amount of RAM a purchased server can have if the original value is
 *                  "max" (case-insensitive), or the original value converted to a number otherwise
 */
function checkRam(ns, ram) {
	// toString() is necessary because JS somewhere implicitly converts the argument to a number
	if (ram.toString().toLowerCase() === "max") {
		return ns.getPurchasedServerMaxRam();
	}

	// check for units at the end
	const unit = ram.toString()[ram.toString().length - 1].toLowerCase();
	switch(unit) {
		case "p":
			return parseInt(ram) * Math.pow(1024, 2);
		case "t":
			return parseInt(ram) * 1024;
		case unit.match(/[0-9]|g/)?.input:
			return parseInt(ram);
		default:
			return 0;
	}
}