export const solvers = {};

solvers["Algorithmic Stock Trader I"] = (data) => {
    let maxCur = 0;
    let maxSoFar = 0;
    for (let i = 1; i < data.length; ++i) {
        maxCur = Math.max(0, maxCur += data[i] - data[i - 1]);
        maxSoFar = Math.max(maxCur, maxSoFar);
    }

    return maxSoFar;
};

solvers["Algorithmic Stock Trader II"] = (data) => {
    let profit = 0;
    for (let p = 1; p < data.length; ++p) {
        profit += Math.max(data[p] - data[p - 1], 0);
    }

    return profit;
};

solvers["Algorithmic Stock Trader III"] = (data) => {
    let hold1 = Number.MIN_SAFE_INTEGER;
    let hold2 = Number.MIN_SAFE_INTEGER;
    let release1 = 0;
    let release2 = 0;
    for (const price of data) {
        release2    = Math.max(release2, hold2 + price);
        hold2       = Math.max(hold2, release1 - price);
        release1    = Math.max(release1, hold1 + price);
        hold1       = Math.max(hold1, price * -1);
    }

    return release2;
};

solvers["Algorithmic Stock Trader IV"] = (data) => {
    const k = (data[0]);
    const prices = (data[1]);

    const len = prices.length;
    if (len < 2) { return (parseInt(ans) === 0); }
    if (k > len / 2) {
        let res = 0;
        for (let i = 1; i < len; ++i) {
            res += Math.max(prices[i] - prices[i-1], 0);
        }

        return res;
    }

    const hold = [];
    const rele = [];
    hold.length = k + 1;
    rele.length = k + 1;
    for (let i = 0; i <= k; ++i) {
        hold[i] = Number.MIN_SAFE_INTEGER;
        rele[i] = 0;
    }

    let cur;
    for (let i = 0; i < len; ++i) {
        cur = prices[i];
        for (let j = k; j > 0; --j) {
            rele[j] = Math.max(rele[j], hold[j] + cur);
            hold[j] = Math.max(hold[j], rele[j-1] - cur);
        }
    }

    return rele[k];
};

solvers["Array Jumping Game"] = (data) => {
    const n = data.length;
    let i = 0;
    for (let reach = 0; i < n && i <= reach; ++i) {
        reach = Math.max(i + data[i], reach);
    }
    const solution = (i === n);
    
    if (solution) {
        return 1;
    }
    else {
        return 0;
    }
};

solvers["Array Jumping Game II"] =  (data) => {
    const n = data.length;
    let reach = 0;
    let jumps = 0;
    let lastJump = -1;
    while (reach < n - 1) {
        let jumpedFrom = -1;
        for (let i = reach; i > lastJump; i--) {
            if (i + data[i] > reach) {
                reach = i + data[i];
                jumpedFrom = i;
            }
        }
        if (jumpedFrom === -1) {
            jumps = 0;
            break;
        }
        lastJump = jumpedFrom;
        jumps++;
    }
    return jumps;
};

solvers["Unique Paths in a Grid I"] = (data) => {
    const n = data[0]; // Number of rows
    const m = data[1]; // Number of columns
    const currentRow = [];
    currentRow.length = n;

    for (let i = 0; i < n; i++) {
        currentRow[i] = 1;
    }
    for (let row = 1; row < m; row++) {
        for (let i = 1; i < n; i++) {
            currentRow[i] += currentRow[i - 1];
        }
    }

    return currentRow[n - 1];
};

solvers["Merge Overlapping Intervals"] = (data) => {

    function convert2DArrayToString(arr) {
        const components = [];
        arr.forEach((e) => {
            let s= e.toString();
            s = ["[", s, "]"].join("");
            components.push(s);
        });

        return components.join(",").replace(/\s/g, "");
    }

    const intervals = data.slice();
    intervals.sort((a, b) => {
        return a[0] - b[0];
    });

    const result = [];
    let start = intervals[0][0];
    let end = intervals[0][1];
    for (const interval of intervals) {
        if (interval[0] <= end) {
            end = Math.max(end, interval[1]);
        } else {
            result.push([start, end]);
            start = interval[0];
            end = interval[1];
        }
    }
    result.push([start, end]);

    const sanitizedResult = convert2DArrayToString(result);
    return sanitizedResult;
};

solvers["Generate IP Addresses"] = (data) => {
    var ret = [];
    for (var i = 1; i <= 3; ++i) {
        for (var j = 1; j <= 3; ++j) {
            for (var k = 1; k <= 3; ++k) {
                for (var l = 1; l <= 3; ++l) {
                    if (i + j + k + l !== data.length) continue;

                    var idxA = 0;
                    var idxB = i;
                    var idxC = i + j;
                    var idxD = idxC + k;

                    var ip = "";
                    var substr = data.substring(idxA, idxB);
                    if (substr.length > 1 && substr.startsWith("0") || parseInt(substr) > 255) continue;
                    ip = substr;

                    substr = data.substring(idxB, idxC);
                    if (substr.length > 1 && substr.startsWith("0") || parseInt(substr) > 255) continue;
                    ip += `.${substr}`;

                    substr = data.substring(idxC, idxD);
                    if (substr.length > 1 && substr.startsWith("0") || parseInt(substr) > 255) continue;
                    ip += `.${substr}`;

                    substr = data.substring(idxD);
                    if (substr.length > 1 && substr.startsWith("0") || parseInt(substr) > 255) continue;
                    ip += `.${substr}`;

                    ret.push(ip);
                }
            }
        }
    }
    /* As of v2.1.0, the results for this contract need to be returned as one string
    instead of an array of strings. See also:
    https://github.com/danielyxie/bitburner/issues/4163
    (Note: they're moving the repo soon (time of writing: 2022-10-23) so the issue
    might be moved with it as well or the repo might be deleted */
    return ret.toString();
};

solvers["Sanitize Parentheses in Expression"] = (data) => {
    let left = 0;
    let right = 0;
    const res = [];

    for (let i = 0; i < data.length; ++i) {
        if (data[i] === '(') {
            ++left;
        } else if (data[i] === ')') {
            (left > 0) ? --left : ++right;
        }
    }

    function dfs(pair, index, left, right, s, solution, res) {
        if (s.length === index) {
            if (left === 0 && right === 0 && pair === 0) {
                for(let i = 0; i < res.length; i++) {
                    if(res[i] === solution) { return; }
                }
                res.push(solution);
            }
            return;
        }

        if (s[index] === '(') {
            if (left > 0) {
                dfs(pair, index + 1, left - 1, right, s, solution, res);
            }
            dfs(pair + 1, index + 1, left, right, s, solution + s[index], res);
        } else if (s[index] === ')') {
            if (right > 0) dfs(pair, index + 1, left, right - 1, s, solution, res);
            if (pair > 0) dfs(pair - 1, index + 1, left, right, s, solution + s[index], res);
        } else {
            dfs(pair, index + 1, left, right, s, solution + s[index], res);
        }
    }

    dfs(0, 0, left, right, data, "", res);
    return res;
};

solvers["Unique Paths in a Grid II"] = (data) => {
    const obstacleGrid = [];
    obstacleGrid.length = data.length;
    for (let i = 0; i < obstacleGrid.length; ++i) {
        obstacleGrid[i] = data[i].slice();
    }

    for (let i = 0; i < obstacleGrid.length; i++) {
        for (let j = 0; j < obstacleGrid[0].length; j++) {
            if (obstacleGrid[i][j] == 1) {
                obstacleGrid[i][j] = 0;
            } else if (i==0 && j==0) {
                obstacleGrid[0][0] = 1;
            } else {
                obstacleGrid[i][j] = (i > 0 ? obstacleGrid[i-1][j] : 0) + ( j > 0 ? obstacleGrid[i][j-1] : 0);
            }
        }
    }

    return (obstacleGrid[obstacleGrid.length -1][obstacleGrid[0].length-1]);
};

/*
  [[-,-,-,-,0,1,0,0,1,1,0],
   [-,-,-,0,1,0,1,1,0,0,0],
   [-,-,1,1,0,0,1,0,1,0,0],
   [-,1,1,0,0,0,0,0,0,0,0],
   [-,0,1,0,0,1,0,1,0,1,0],
   [1,0,0,0,0,0,0,0,0,0,0],
   [0,0,0,0,0,0,0,0,0,0,0]]

|--> DDDDRDDRRRRRRRRR
actual: ""
*/
solvers["Shortest Path in a Grid"] = (data) => {
    var rowCount = data.length;
    var colCount = data[0].length;
    // comparing single numbers in a 1d array is a lot easier than
    // comparing 2d arrays and nodes represented by 2-tuples
    var flatGraph = data.flat();
    var goal = flatGraph.length - 1;
    var distances = new Array(rowCount * colCount).fill(Infinity);
    distances[0] = 0;
    var currentRow = 0;
    var currentCol = 0;
    var paths = [[0]];

    // now do the Dijkstra
    for (var currentDist = 1; distances.includes(Infinity); currentDist++) {
        if (!paths.length) {
            // all dead ends
            return "";
        }

        var newPaths = [];
        for (var path of paths) {
            var prevNode = path[path.length - 1];
            var row = Math.floor(prevNode / colCount);
            var col = prevNode % colCount;

            // adjacent nodes in the order: up, down, left, right
            var adjNodes = [];
            if (row > 0) adjNodes.push(prevNode - colCount);
            if (row < rowCount - 1) adjNodes.push(prevNode + colCount);
            if (col > 0) adjNodes.push(prevNode - 1);
            if (col < colCount - 1) adjNodes.push(prevNode + 1);
            for (var adjNode of adjNodes) {
                if (flatGraph[adjNode] === 0 && distances[adjNode] === Infinity) {
                    var pathCopy = [...path];
                    pathCopy.push(adjNode);
                    // goal found?
                    if (adjNode === flatGraph.length - 1) {
                        var dirMap = { "-1": "L", "1": "R" };
                        // for some reason, JS doesn't like it if I define these like "L" and "R" above
                        // JS is weird o_O (gotta think so hard of the "wat" video rn lol)
                        dirMap[(-colCount).toString()] = "U";
                        dirMap[colCount.toString()] = "D";
                        var output = "";
                        for (var i = 0; i < pathCopy.length - 1; i++) {
                            output += dirMap[(pathCopy[i + 1] - pathCopy[i]).toString()];
                        }
                        return output;
                    }
                    newPaths.push(pathCopy);
                    distances[adjNode] = currentDist;
                }
            }
        }

        paths = newPaths;
    }
};

solvers["Find Largest Prime Factor"] = (data) => {
    let fac = 2;
    let n = data;
    while (n > ((fac-1) * (fac-1))) {
        while (n % fac === 0) {
            n = Math.round(n / fac);
        }
        ++fac;
    }

    return (n===1 ? (fac-1) : n);
};

solvers["Subarray with Maximum Sum"] = (data) => {
    const nums = data.slice();
    for (let i = 1; i < nums.length; i++) {
        nums[i] = Math.max(nums[i], nums[i] + nums[i - 1]);
    }

    return Math.max(...nums);
};

solvers["Total Ways to Sum"] = (data) => {
    const ways = [1];
    ways.length = data + 1;
    ways.fill(0, 1);
    for (let i = 1; i < data; ++i) {
        for (let j = i; j <= data; ++j) {
            ways[j] += ways[j - i];
        }
    }

    return ways[data];
};

solvers["Total Ways to Sum II"] = (data) => {
    // https://www.geeksforgeeks.org/coin-change-dp-7/?ref=lbp
    const n = data[0];
    const s = data[1];
    const ways = [1];
    ways.length = n + 1;
    ways.fill(0, 1);
    for (let i = 0; i < s.length; i++) {
        for (let j = s[i]; j <= n; j++) {
            ways[j] += ways[j - s[i]];
        }
    }
    return ways[n];
};

solvers["Find All Valid Math Expressions"] = (data) => {
    const num = data[0];
    const target = data[1];

    function helper(res, path, num, target, pos, evaluated, multed) {
        if (pos === num.length) {
            if (target === evaluated) {
                res.push(path);
            }
            return;
        }

        for (let i = pos; i < num.length; ++i) {
            if (i != pos && num[pos] == '0') { break; }
            const cur = parseInt(num.substring(pos, i+1));

            if (pos === 0) {
                helper(res, path + cur, num, target, i + 1, cur, cur);
            } else {
                helper(res, path + "+" + cur, num, target, i + 1, evaluated + cur, cur);
                helper(res, path + "-" + cur, num, target, i + 1, evaluated - cur, -cur);
                helper(res, path + "*" + cur, num, target, i + 1, evaluated - multed + multed * cur, multed * cur);
            }
        }
    }

    const result= [];
    helper(result, "", num, target, 0, 0, 0);
    
    return result;

};

solvers["Spiralize Matrix"] = (data) => {
    const spiral = [];
    const m = data.length;
    const n = data[0].length;
    let u = 0;
    let d = m - 1;
    let l = 0;
    let r = n - 1;
    let k = 0;
    while (true) {
        // Up
        for (let col= l; col <= r; col++) {
            spiral[k] = data[u][col];
            ++k;
        }
        if (++u > d) { break; }

        // Right
        for (let row = u; row <= d; row++) {
            spiral[k] = data[row][r];
            ++k;
        }
        if (--r < l) { break; }

        // Down
        for (let col = r; col >= l; col--) {
            spiral[k] = data[d][col];
            ++k;
        }
        if (--d < u) { break; }

        // Left
        for (let row = d; row >= u; row--) {
            spiral[k] = data[row][l];
            ++k;
        }
        if (++l > r) { break; }
    }
    return spiral;
};

solvers["Minimum Path Sum in a Triangle"] = (data) => {
    const n = data.length;
    const dp = data[n-1].slice();
    for (let i = n-2; i > -1; --i) {
        for (let j = 0; j < data[i].length; ++j) {
            dp[j] = Math.min(dp[j], dp[j + 1]) + data[i][j];
        }
    }

    return dp[0];
};

solvers["HammingCodes: Integer to Encoded Binary"] = (value) => {
    // encoding following Hammings rule
    function HammingSumOfParity(_lengthOfDBits) {
        // will calculate the needed amount of parityBits 'without' the "overall"-Parity (that math took me 4 Days to get it working)
        return _lengthOfDBits < 3 || _lengthOfDBits == 0 // oh and of course using ternary operators, it's a pretty neat function
        ? _lengthOfDBits == 0
            ? 0
            : _lengthOfDBits + 1
        : // the following math will only work, if the length is greater equal 3, otherwise it's "kind of" broken :D
        Math.ceil(Math.log2(_lengthOfDBits * 2)) <=
            Math.ceil(Math.log2(1 + _lengthOfDBits + Math.ceil(Math.log2(_lengthOfDBits))))
        ? Math.ceil(Math.log2(_lengthOfDBits) + 1)
        : Math.ceil(Math.log2(_lengthOfDBits));
    }
    const _data = value.toString(2).split(""); // first, change into binary string, then create array with 1 bit per index
    const _sumParity = HammingSumOfParity(_data.length); // get the sum of needed parity bits (for later use in encoding)
    const count = (arr, val) =>
        arr.reduce((a, v) => (v === val ? a + 1 : a), 0);
    // function count for specific entries in the array, for later use
    
    const _build = ["x", "x", ..._data.splice(0, 1)]; // init the "pre-build"
    for (let i = 2; i < _sumParity; i++) {
        // add new paritybits and the corresponding data bits (pre-building array)
        _build.push("x", ..._data.splice(0, Math.pow(2, i) - 1));
    }
    // now the "calculation"... get the paritybits ('x') working
    for (const index of _build.reduce(function (a, e, i) {
        if (e == "x") a.push(i);
        return a;
    }, [])) {
        // that reduce will result in an array of index numbers where the "x" is placed
        const _tempcount = index + 1; // set the "stepsize" for the parityBit
        const _temparray = []; // temporary array to store the extracted bits
        const _tempdata = [..._build]; // only work with a copy of the _build
        while (_tempdata[index] !== undefined) {
        // as long as there are bits on the starting index, do "cut"
        const _temp = _tempdata.splice(index, _tempcount * 2); // cut stepsize*2 bits, then...
        _temparray.push(..._temp.splice(0, _tempcount)); // ... cut the result again and keep the first half
        }
        _temparray.splice(0, 1); // remove first bit, which is the parity one
        _build[index] = (count(_temparray, "1") % 2).toString(); // count with remainder of 2 and"toString" to store the parityBit
    } // parity done, now the "overall"-parity is set
    _build.unshift((count(_build, "1") % 2).toString()); // has to be done as last element
    return _build.join(""); // return the _build as string
};

solvers["HammingCodes: Encoded Binary to Integer"] = (_data) => {
    //check for altered bit and decode
    const _build = _data.split(""); // ye, an array for working, again
    const _testArray = []; //for the "truthtable". if any is false, the data has an altered bit, will check for and fix it
    const _sumParity = Math.ceil(Math.log2(_data.length)); // sum of parity for later use
    const count = (arr, val) =>
        arr.reduce((a, v) => (v === val ? a + 1 : a), 0);
    // the count.... again ;)
    
    let _overallParity = _build.splice(0, 1).join(""); // store first index, for checking in next step and fix the _build properly later on
    _testArray.push(_overallParity == (count(_build, "1") % 2).toString() ? true : false); // first check with the overall parity bit
    for (let i = 0; i < _sumParity; i++) {
        // for the rest of the remaining parity bits we also "check"
        const _tempIndex = Math.pow(2, i) - 1; // get the parityBits Index
        const _tempStep = _tempIndex + 1; // set the stepsize
        const _tempData = [..._build]; // get a "copy" of the build-data for working
        const _tempArray = []; // init empty array for "testing"
        while (_tempData[_tempIndex] != undefined) {
        // extract from the copied data until the "starting" index is undefined
        const _temp = [..._tempData.splice(_tempIndex, _tempStep * 2)]; // extract 2*stepsize
        _tempArray.push(..._temp.splice(0, _tempStep)); // and cut again for keeping first half
        }
        const _tempParity = _tempArray.shift(); // and again save the first index separated for checking with the rest of the data
        _testArray.push(_tempParity == (count(_tempArray, "1") % 2).toString() ? true : false);
        // is the _tempParity the calculated data? push answer into the 'truthtable'
    }
    let _fixIndex = 0; // init the "fixing" index and start with 0
    for (let i = 1; i < _sumParity + 1; i++) {
        // simple binary adding for every boolean in the _testArray, starting from 2nd index of it
        _fixIndex += _testArray[i] ? 0 : Math.pow(2, i) / 2;
    }
    _build.unshift(_overallParity); // now we need the "overall" parity back in it's place
    // try fix the actual encoded binary string if there is an error
    if (_fixIndex > 0 && _testArray[0] == false) {
        // if the overall is false and the sum of calculated values is greater equal 0, fix the corresponding hamming-bit
        _build[_fixIndex] = _build[_fixIndex] == "0" ? "1" : "0";
    } else if (_testArray[0] == false) {
        // otherwise, if the the overall_parity is the only wrong, fix that one
        _overallParity = _overallParity == "0" ? "1" : "0";
    } else if (_testArray[0] == true && _testArray.some((truth) => truth == false)) {
        return 0; // uhm, there's some strange going on... 2 bits are altered? How? This should not happen 👀
    }
    // oof.. halfway through... we fixed an possible altered bit, now "extract" the parity-bits from the _build
    for (let i = _sumParity; i >= 0; i--) {
        // start from the last parity down the 2nd index one
        _build.splice(Math.pow(2, i), 1);
    }
    _build.splice(0, 1); // remove the overall parity bit and we have our binary value
    return parseInt(_build.join(""), 2); // parse the integer with redux 2 and we're done!
};

solvers["Proper 2-Coloring of a Graph"] = ([N, edges]) => {
    //Helper function to get neighbourhood of a vertex
    function neighbourhood(vertex) {
        const adjLeft = edges.filter(([a, _]) => a == vertex).map(([_, b]) => b);
        const adjRight = edges.filter(([_, b]) => b == vertex).map(([a, _]) => a);
        return adjLeft.concat(adjRight);
    }

    const coloring = Array(N).fill(undefined);
    while (coloring.some((val) => val === undefined)) {
        //Color a vertex in the graph
        const initialVertex = coloring.findIndex((val) => val === undefined);
        coloring[initialVertex] = 0;
        const frontier = [initialVertex];

        //Propogate the coloring throughout the component containing v greedily
        while (frontier.length > 0) {
            const v = frontier.pop() || 0;
            const neighbors = neighbourhood(v);

            //For each vertex u adjacent to v
            for (const id in neighbors) {
                const u = neighbors[id];

                //Set the color of u to the opposite of v's color if it is new,
                //then add u to the frontier to continue the algorithm.
                if (coloring[u] === undefined) {
                    if (coloring[v] === 0) coloring[u] = 1;
                    else coloring[u] = 0;

                    frontier.push(u);
                }

                //Assert u,v do not have the same color
                else if (coloring[u] === coloring[v]) {
                    //If u,v do have the same color, no proper 2-coloring exists
                    return [];
                }
            }
        }
    }

    //If this code is reached, there exists a proper 2-coloring of the input graph.
    return coloring;
};

solvers["Compression I: RLE Compression"] = (str) => {
	const encoding = [];
	let count, previous, i;
	for (count = 1, previous = str[0], i = 1; i < str.length; i++) {
		if (str[i] !== previous || count === 9) {
			encoding.push(count, previous);
			count = 1;
			previous = str[i];
		} else count++;
	}
	encoding.push(count, previous);
	return encoding.join('');
}

solvers["Compression II: LZ Decompression"] = (str) => {
	let decoded = '', type = 0, len, ref, pos, i = 0, j;
	while (i < str.length) {
		if (i > 0) type ^= 1;
		len = parseInt(str[i]);
		ref = parseInt(str[++i]);
		if (len === 0) continue;
		if (!isNaN(ref) && type === 1) {
			i++;
			for (j = 0; j < len; j++) decoded += decoded[decoded.length - ref];
		} else {
			pos = i;
			for (; i < len + pos; i++) decoded += str[i];
		}
	}
	return decoded;
}

solvers["Compression III: LZ Compression"] = (str) => {

    function setState(state, i, j, str) {
	    if (state[i][j] === undefined || str.length < state[i][j].length) state[i][j] = str;
    }
	
    // state [i][j] contains a backreference of offset i and length j
	let cur_state = Array.from(Array(10), _ => Array(10)), new_state, tmp_state, result;
	cur_state[0][1] = ''; // initial state is a literal of length 1
	for (let i = 1; i < str.length; i++) {
		new_state = Array.from(Array(10), _ => Array(10));
		const c = str[i];
		// handle literals
		for (let len = 1; len <= 9; len++) {
			const input = cur_state[0][len];
			if (input === undefined) continue;
			if (len < 9) setState(new_state, 0, len + 1, input); // extend current literal
			else setState(new_state, 0, 1, input + '9' + str.substring(i - 9, i) + '0'); // start new literal
			for (let offset = 1; offset <= Math.min(9, i); offset++) { // start new backreference
				if (str[i - offset] === c) setState(new_state, offset, 1, input + len + str.substring(i - len, i));
			}
		}
		// handle backreferences
		for (let offset = 1; offset <= 9; offset++) {
			for (let len = 1; len <= 9; len++) {
				const input = cur_state[offset][len];
				if (input === undefined) continue;
				if (str[i - offset] === c) {
					if (len < 9) setState(new_state, offset, len + 1, input); // extend current backreference
					else setState(new_state, offset, 1, input + '9' + offset + '0'); // start new backreference
				}
				setState(new_state, 0, 1, input + len + offset); // start new literal
				// end current backreference and start new backreference
				for (let new_offset = 1; new_offset <= Math.min(9, i); new_offset++) {
					if (str[i - new_offset] === c) setState(new_state, new_offset, 1, input + len + offset + '0');
				}
			}
		}
		tmp_state = new_state;
		new_state = cur_state;
		cur_state = tmp_state;
	}
	for (let len = 1; len <= 9; len++) {
		let input = cur_state[0][len];
		if (input === undefined) continue;
		input += len + str.substring(str.length - len, str.length);
		// noinspection JSUnusedAssignment
		if (result === undefined || input.length < result.length) result = input;
	}
	for (let offset = 1; offset <= 9; offset++) {
		for (let len = 1; len <= 9; len++) {
			let input = cur_state[offset][len];
			if (input === undefined) continue;
			input += len + '' + offset;
			if (result === undefined || input.length < result.length) result = input;
		}
	}
	return result ?? '';
}

solvers["Encryption I: Caesar Cipher"] = (data) => {
    const aOrd = "A".charCodeAt(0);
    const spaceOrd = " ".charCodeAt(0);

    var plainText = data[0];
    var leftShift = data[1];
    
    var encoded = ""
    for (var i = 0; i < plainText.length; i++) {
        var charCode = plainText.charCodeAt(i);
        /* Right now I hate JavaScript coz (negative number) % (positive number) < 0.
        So we have to add 26 afterwards. And do another "% 26". Sooo we don't get
        behind "Z" in the ASCII/UTF-foo table. <insert appropriate swearwords here>
        Note: "%" has a higher precedence than "+" and "-" */
        encoded += charCode === spaceOrd ? " " :
            String.fromCharCode(((charCode - leftShift - aOrd) % 26 + 26) % 26 + aOrd);
    }

    return encoded;
}

solvers["Encryption II: Vigenère Cipher"] = (data) => {
    const aOrd = "A".charCodeAt(0);
    var plainText = data[0];
    var keyword = data[1];
    var encoded = ""
    for (var i = 0; i < plainText.length; i++) {
        encoded += String.fromCharCode(
            (plainText.charCodeAt(i) - aOrd
            + keyword.charCodeAt(i % keyword.length) - aOrd) % 26 + aOrd);
    }

    return encoded;
}