function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
const EDO = require("../edo").EDO
let divisions = 12
edo = new EDO(divisions)
let scale = edo.scale([0,1,2,3,4,5,6,7,8,9,10,11])
let tets = scale.get.tetrachords()
tets = tets.filter((tet)=>(edo.scale(tet).count.consecutive_steps(1)<2)?true:false)
console.log(tets)