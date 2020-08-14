const JS = function (thing) {
    return JSON.stringify(thing).replace(/"/g,'')
}
const EDO = require("../../edo").EDO
const Scale = require("../../edo").Scale

let edo = new EDO(12) //Create a tuning context
// let scale = edo.scale([0,2,4,7,9]) //define new scale
let scale = edo.scale([0,2,3,5,6,8,9,11]) //define new scale
// let scale = edo.scale([0,2,4,5,7,9,11]) //define new scale
// console.log(edo.get.normal_order([0,18,2,3]))
// console.log(edo.get.random_melody(4, [-3, 2])); //returns e.g. [ -2, -1, 1, 2 ]
// console.log(edo.get.random_melody(4, [-3, 2],1)); //returns e.g. [ 2, 1, -3, -2 ]
// console.log(edo.get.random_melody(6, [0, 17], 6,[0, 2, 4, 5, 7, 9, 11])); // returns e.g. [ 7, 9, 2, 17, 4, 4 ]
// console.log(scale.get.sequence_transposition([0,2,4],1))

console.log(scale.get.common_tone_transpositions())








