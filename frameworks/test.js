function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
const EDO = require("../edo").EDO
let edo = new EDO(12)
let scales = edo.get.scales()
// scales=scales.filter((scale)=>scale.count.pitches()==7)

// scales = scales.filter((scale)=>scale.get.position_of_quality([0,4,6,8,11]).length>0)
// scales=scales.filter((scale)=>scale.count.consecutive_steps(1)<2)
// scales.forEach((scale)=>{
//     console.log(JSON.stringify(scale.pitches))
// })

let scale = edo.scale([0,2,4,5,7,9,11])
console.log(scale.get.transpositions_with_pitches([1,4,8]))








