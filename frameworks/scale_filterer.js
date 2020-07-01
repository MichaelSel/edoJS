const EDO = require("../edo")

const JS = function (thing) {
    return JSON.stringify(thing).replace(/"/g,'')
}

edo = new EDO(12)
let scales = edo.get.scales(1,6,2,4)
console.log("Found",scales.length,"scales. Filtering...")
// scales = scales.filter((scale)=>scale.count.pitches()<9)
// scales = scales.filter((scale)=>scale.count.pitches()>4)
// scales = scales.filter((scale)=>scale.get.rothenberg_propriety()!="improper")
// scales = scales.filter((scale)=>scale.count.transpositions()==scale.edo)
// scales = scales.filter((scale)=>scale.count.chord_quality([4,7])>1)



for (let scale of scales) {
    console.log(JS(scale.pitches))
}



