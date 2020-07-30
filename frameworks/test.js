function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
const EDO = require("../edo").EDO
let edo = new EDO(12)
let scales = edo.get.scales()
scales = scales.filter((scale)=>{
    return scale.get.position_of_quality([1,4]).length>0
}).filter((scale)=>scale.count.consecutive_steps(1)<2)

console.log(scales.length)
scales.forEach((scale)=>{
    console.log(JSON.stringify(scale.pitches))
})







