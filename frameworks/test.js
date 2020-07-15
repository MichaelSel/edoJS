const EDO = require("../edo").EDO
let divisions = 12
edo = new EDO(divisions)

// for (let i = 0; i < 10; i++) {
//     let random_set = edo.get.random_melody(5,[0,11],5,[0,1,2,3,4,5,6,7,8,9,10,11],12)
//     console.log(random_set)
//     let melody = edo.get.random_melody(16,[0,12],2,random_set,5)
//     console.log(JSON.stringify(edo.convert.midi_to_name(melody,60)))
// }

let scales = edo.get.scales(1,12,1,12)
scales = scales.filter((scale)=>scale.count.pitches()==5)

// for(let scale of scales) {
//     console.log(scale.is.invertible())
// }

let scale = edo.scale([0,2,4,5,7,9,11])
console.log(scale.get.interval_vector())
