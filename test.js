const JS = function (thing) {
    return JSON.stringify(thing).replace(/"/g,'')
}
const EDO = require("./edo").EDO
const Scale = require("./edo").Scale

let edo = new EDO(12) //Create a tuning context
let scale = new Scale([0, 2, 3, 5, 6, 8, 9, 11 ],edo)
    console.log(scale.count.transpositions()) //returns 12
    console.log(scale.is.mode_of([0,1,3,4,6,7,9,10])) //returns true
console.log(scale.to.cents()); //returns [0, 200, 400, 500, 700, 900, 1100]
console.log(scale.get.stacks(3, 2));//returns [ [ 0, 4, 7 ], [ 0, 3, 7 ], [ 0, 3, 6 ] ]





