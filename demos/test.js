const JS = function (thing) {
    return JSON.stringify(thing).replace(/"/g,'')
}
const EDO = require("../edo").EDO
const Scale = require("../edo").Scale

let edo = new EDO(12) //Create a tuning context
// let scale = edo.scale([0,2,4,7,9]) //define new scale
let scale = edo.scale([0,2,4,5,7,9,11]) //define new scale
// let scale = edo.scale([0,4,7]) //Major triad

let time1 = Date.now()
console.log(scale.get.n_chords(7,true),Date.now()-time1)







