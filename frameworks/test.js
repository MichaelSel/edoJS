function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
const EDO = require("../edo").EDO
edo12 = new EDO(12)
edo14 = new EDO(14)
let prom = edo12.scale([0, 2, 4, 6, 9, 10])
console.log("prometheus #transpositions:",prom.count.transpositions(),'/12')
let triton = edo12.scale([0, 1, 4, 6, 7, 10])
console.log("triton #transpositions:",triton.count.transpositions(),'/12')
let whoeltone = edo12.scale([0, 2, 4, 6, 8, 10])
console.log("whole-tone #transpositions:",whoeltone.count.transpositions(),'/12')
let assym_6 = edo12.scale([0,1,3,4,7,10])
console.log("hexatonic asymmetric #transpositions:",assym_6.count.transpositions(),'/12')
let sym_6 = edo12.scale([0,3,4,6,9,10])
console.log("hexatonic symmetric #transpositions:",sym_6.count.transpositions(),'/12')
let uni_6 = edo12.scale([0,2,4,6,8,10])
console.log("hexatonic uniform #transpositions:",uni_6.count.transpositions(),'/12')

let assym_7 = edo14.scale([0,1,3,5,8,9,11])
console.log("heptatonic asymmetric #transpositions:",assym_7.count.transpositions(),'/14')
let sym_7 = edo14.scale([0,2,3,6,8,11,12])
console.log("heptatonic symmetric #transpositions:",sym_6.count.transpositions(),'/14')
let uni_7 = edo14.scale([0,2,4,6,8,10,12])
console.log("heptatonic uniform #transpositions:",uni_6.count.transpositions(),'/14')