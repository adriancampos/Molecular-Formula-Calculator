target_min = 0;
target_max = 0;
masses = {};
counts_min = {};
counts_max = {};

results = [];

function compute() {
    document.getElementById("result").value = "ERROR";

    // Load from UI
    target_min = parseFloat(document.getElementById("text_target_min").value);
    target_max = parseFloat(document.getElementById("text_target_max").value);

    masses = {}
    document.getElementById("text_masses").value.split("\n").forEach(line => {
        masses[line.split(":")[0]] = parseFloat(line.split(":")[1]);
    });

    counts_min = {}
    document.getElementById("text_counts_min").value.split("\n").forEach(line => {
        counts_min[line.split(":")[0]] = parseInt(line.split(":")[1]);
    });

    counts_max = {}
    document.getElementById("text_counts_max").value.split("\n").forEach(line => {
        counts_max[line.split(":")[0]] = parseInt(line.split(":")[1]);
    });


    results = [];
    recurs(copy(counts_min));

    console.log(results)

    // Convert to chemical formula string
    formulas = results.map(r => {
        return Object.entries(r).map(e => e[1] > 0 ? "" + e[0] + e[1] : "").join('')  +
        " " + get_mass(r);
    });

    // remove duplicates
    formulas = [...new Set(formulas)]

    console.log(formulas);

    document.getElementById("result").value = formulas.join("\n");
}

function copy(obj) {
    return JSON.parse(JSON.stringify(obj))
}

function get_mass(counts) {
    return Object.keys(counts).map(function (key, index) {
        return masses[key] * counts[key]
    }).reduce((acc, curr) => acc + curr)
}

function recurs(counts) {
    if (get_mass(counts) > target_max) {
        return;
    }

    if (get_mass(counts) > target_min) {
        results.push(counts)
    }

    // try to add one of everything in every combination
    Object.keys(counts).forEach(e => {
        if (!counts_max[e] || counts[e] + 1 <= counts_max[e]) {
            counts_c = copy(counts)
            counts_c[e] += 1
            recurs(counts_c)
        }
    })
}
