function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
const EDO = require("../edo").EDO
let divisions = 12
edo = new EDO(divisions)
let scale = edo.scale([0,1,4,6,7,10] )
let subsets = scale.parent.get.subsets(scale.pitches,true,true)
subsets = subsets
    .map((subset)=>edo.scale(subset)) //to scale Object
    .filter((subset)=>subset.count.transpositions()==12) // Filter MOLT out
    .map((subset)=>subset.pitches) // get pitches
    .forEach((subset)=>console.log(subset,scale.get.position_of_quality(subset)))

