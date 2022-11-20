import { solvers } from "solvers.js";

/**
 * Searches all available servers for contracts and tries to solve them periodically.
 * 
 * @param {NS} ns It's everywhere
 */
export async function main(ns) {
    if (!ns.args.length) throw "Missing arguments: list of servers";
    
    solveAllContracts(ns, ns.args);
}

/**
 * Solves all coding contracts (if any) on all servers.
 * 
 * @param {NS} ns It's everywhere
 * @param {string[]} servers All servers on which so search for contracts
 */
export function solveAllContracts(ns, servers) {
    const solved = { true: 0, false: 0 };
    servers.forEach((server) => {
        ns.ls(server, ".cct").forEach((contract) => {
            const type = ns.codingcontract.getContractType(contract, server);
            const data = ns.codingcontract.getData(contract, server);
            if (type in solvers) {
                ns.print(`${server}: ${contract} (${type}) -- input: ${data}`);
                const solution = solvers[type](data);
                ns.print(`${server}:${contract} (${type}) -- solution: ${solution}`)
				solved[ns.codingcontract.attempt(solution, contract, server)]++;
            } else {
				ns.print(`No solver found for ${contract} ("${type}") on ${server}!`);
                solved[false]++;
            }
        });
    });
    ns.print(`Found ${solved[true] + solved[false]} contracts `
        + `(${solved[true]} solved, ${solved[false]} failed).`);
}