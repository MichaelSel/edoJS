const EDO = require("./edo")
let edo = new EDO(12)
let scale = edo.scale([0,2,4,5,7,9,11])
console.log(scale.pitches)
console.log(scale.mode(1).pitches)