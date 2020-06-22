const JS = function (thing) {
    return JSON.stringify(thing).replace(/"/g,'')
}
const EDO = require("./edo")
let edo = new EDO(12)
let scale = edo.scale([0, 2,4,7,9,11])
console.log(JS(edo.get.lattice()))
