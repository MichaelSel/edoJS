const JS = function (thing) {
    return JSON.stringify(thing).replace(/"/g,'')
}
const EDO = require("./edo")
let edo = new EDO(12)

console.log(edo.get.motives([7,6,7,6,7,2,5,3,0]).slice(0,4))




