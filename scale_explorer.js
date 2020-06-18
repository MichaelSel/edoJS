const EDO = require("./edo")
edo = new EDO(12)

let scale
    
/*
7-NOTE SCALES:
*/



// scale = edo.scale([0, 1, 2, 4, 6, 8, 10])
// scale = edo.scale([0, 1, 3, 4, 7, 8, 10])
// scale = edo.scale([0, 1, 3, 4, 7, 8, 11])  // 1p-p5pl based on two augmented triads+added note
// scale = edo.scale([0, 1, 4, 5, 7, 8, 11])  // 1p+p5pl
// scale = edo.scale([0, 2, 3, 6, 7, 8, 11])
// scale = edo.scale([0, 2, 4, 6, 7, 8, 10])  // same necklace minor: [0,1,3,5,7,9,11] 1n+l5pn
// scale = edo.scale([0, 2, 4, 6, 8, 10, 11])
// scale = edo.scale([0, 3, 4, 6, 7, 8, 11])  // 1l+l5pl based on two augmented triads+added note
// scale = edo.scale([0, 3, 4, 6, 7, 9, 10])  // octatonic without note 2 1l+l5lp


/*
6-NOTE SCALES:
*/
// scale = edo.scale([0, 1, 2, 3, 6, 9])
// scale = edo.scale([0, 1, 2, 4, 6, 9])
// scale = edo.scale([0, 1, 2, 4, 7, 9])
// scale = edo.scale([0, 1, 2, 4, 7, 10])
// scale = edo.scale([0, 1, 2, 5, 6, 9])
// scale = edo.scale([0, 1, 2, 5, 7, 9])
// scale = edo.scale([0, 1, 2, 5, 7, 10])
// scale = edo.scale([0, 1, 2, 5, 8, 9])
// scale = edo.scale([0, 1, 2, 5, 8, 10])
// scale = edo.scale([0, 1, 3, 4, 6, 9])
// scale = edo.scale([0, 1, 3, 4, 7, 9])
// scale = edo.scale([0, 1, 3, 4, 7, 10])
// scale = edo.scale([0, 1, 3, 5, 6, 9])
// scale = edo.scale([0, 1, 3, 5, 7, 9])
// scale = edo.scale([0, 1, 3, 5, 7, 10])
// scale = edo.scale([0, 1, 3, 5, 8, 9])
// scale = edo.scale([0, 1, 3, 5, 8, 10])
// scale = edo.scale([0, 1, 3, 6, 7, 9])
// scale = edo.scale([0, 1, 3, 6, 7, 10])
// scale = edo.scale([0, 1, 3, 6, 8, 9])
// scale = edo.scale([0, 1, 3, 6, 8, 10])
// scale = edo.scale([0, 1, 4, 5, 7, 9])
// scale = edo.scale([0, 1, 4, 5, 8, 9])
// scale = edo.scale([0, 1, 4, 5, 8, 10])
// scale = edo.scale([0, 1, 4, 6, 7, 10])
// scale = edo.scale([0, 1, 4, 6, 8, 10])
// scale = edo.scale([0, 2, 4, 6, 8, 11])
// scale = edo.scale([0, 2, 3, 6, 7, 11]) // this may be the mode of another
// scale = edo.scale([0, 2, 3, 6, 8, 11]) // this may be the mode of another
// scale = edo.scale([0, 3, 6, 7, 8, 11])



/*
5-NOTE SCALES:
*/

// scale = edo.scale([0, 1, 3, 6, 9])
// scale = edo.scale([0, 1, 4, 6, 9])
// scale = edo.scale([0, 1, 4, 7, 9])
// scale = edo.scale([0, 1, 4, 7, 10])
// scale = edo.scale([0, 2, 4, 6, 9])
// scale = edo.scale([0, 2, 4, 7, 9])
// scale = edo.scale([0, 4, 6, 8, 11])

// scale = edo.scale([0, 3, 6, 10])  // half dim is a scale!








const JS = function (thing) {
    return JSON.stringify(thing).replace(/"/g,'')
}
console.log("INFO ON SCALE:", JS(scale.pitches))
console.log("Rothenberg:", scale.get.rothenberg_propriety())
console.log("Gravity:", JS(scale.get.lerdahl_attraction_vector()))
console.log("Transpositions:", scale.count.transpositions())
console.log('\n\n')


console.log("COMMON-TONE TRANSPOSITIONS:")
for (let trans of scale.get.common_tone_transpositions()) {
    console.log("Pitches:",JS(trans[0].map((a)=>edo.convert.pc_to_name(a))),"Notes altered from original:",JS(trans[1]))
}


console.log("")
console.log("TRICHORDS:")
for (let tri of scale.get.trichords()) {
    console.log("Pitches:", tri,"Occurrence:", scale.get.position_of_quality(tri))
}

console.log("")
console.log("TETRACHORDS:")
for (tetra of scale.get.tetrachords()) {
    console.log("Pitches:", tetra, "Occurrence:", scale.get.position_of_quality(tetra))
}

console.log("")
console.log("STACKS (1-x-1-x-1):")
for (let stack of scale.get.stacks(3,1)) {
    console.log('3rds',stack,"Occurrence:",scale.get.position_of_quality(stack))
}

console.log("")
console.log("STACKS (1-x-1-x-1-x-1):")
for (let stack of scale.get.stacks(4,1)) {
    console.log('3rds',stack,"Occurrence:",scale.get.position_of_quality(stack))
}

console.log("")
console.log("STACKS (1-x-1-x-1-x-1-x-1-x-1):")
for (let stack of scale.get.stacks(6,1)) {
    console.log('3rds',stack,"Occurrence:",scale.get.position_of_quality(stack))
}

console.log("")
console.log("STACKS (1-x-x-1-x-x-1):")
for (let stack of scale.get.stacks(3,2)) {
    console.log('4ths',stack,"Occurrence:",scale.get.position_of_quality(stack))
}

console.log("")
console.log("STACKS (1-x-x-1-x-x-1-x-x-1):")
for (let stack of scale.get.stacks(4,2)) {
    console.log('4ths',stack,"Occurrence:",scale.get.position_of_quality(stack))
}

console.log("\nINTERVAL VECTOR:",scale.get.interval_vector())


