const EDO = require("../edo").EDO
edo = new EDO(12)

let scale

/*
All 8-NOTE SCALES (with no 2 consecutive semitones):
*/
// scale = edo.scale([0,1,3,4,6,7,9,10])

    
/*
All 7-NOTE SCALES (with no 2 consecutive semitones):
*/

// scale = edo.scale([0,1,3,4,6,7,9]) //Subset of octatonic *** //Mode 3 is nice
// scale = edo.scale([0,1,3,4,6,8,9]) //Harmonic Minor (on 1), 6 & 9 are nice too
// scale = edo.scale([0,1,3,4,6,8,10]) //***Melodic Minor (on 1). 0, 3 (phrygian #6), 6 (lydian b7), 8 (mixolydian b6), 10 (locrian #2)
// scale = edo.scale([0,1,3,5,6,8,9]) //"Harmonic Major" (on 8). 1 & 3 are interesting.
// scale = edo.scale([0,1,3,5,6,8,10]) //Diatonic
// scale = edo.scale([0,2,3,5,6,8,9]) //Subset of octatonic *** //Modes 1, 3, and 6 are nice


/*
Other 7-NOTE SCALES of interest:
*/
// scale = edo.scale([0, 1, 2, 4, 6, 8, 10])
// scale = edo.scale([0, 1, 3, 4, 7, 8, 10])
// scale = edo.scale([0, 1, 3, 4, 7, 8, 11])  // 1p-p5pl based on two augmented triads+added note
// scale = edo.scale([0, 1, 4, 5, 7, 8, 11])  // 1p+p5pl
// scale = edo.scale([0, 2, 4, 6, 7, 8, 10])  // same necklace minor: [0,1,3,5,7,9,11] 1n+l5pn
// scale = edo.scale([0, 3, 4, 6, 7, 8, 11])  // 1l+l5pl based on two augmented triads+added note

/*
7-NOTE Vector scales:
*/

// scale = edo.scale([0,1,2,4,5,7,9]) //1l+p5pn [0,3,4,5,7,8,10]
// scale = edo.scale([0,1,2,4,5,8,9]) //1l+p5pl [0,3,4,5,7,8,11]
// scale = edo.scale([0,1,2,4,6,7,9]) //1l+p5nn [0,3,4,5,7,9,10]
// scale = edo.scale([0,1,2,4,6,8,9]) //1l+p5nl [0,3,4,5,7,9,11]
// scale = edo.scale([0,1,2,4,6,8,10]) //1n+l5pn [0,2,4,6,7,8,10]
// scale = edo.scale([0,1,2,5,6,8,9]) //1p+p5pl [0,1,4,5,7,8,11]
// scale = edo.scale([0,1,3,4,5,7,9]) //1l+l5pn [0,3,4,6,7,8,10]
// scale = edo.scale([0,1,3,4,6,7,9]) //1l+l5nn [0,3,4,6,7,9,10]
// scale = edo.scale([0,1,3,4,6,8,9]) //1l+l5nl [0,3,4,6,7,9,11] SAME AS BELOW
// scale = edo.scale([0,1,3,4,6,8,9]) //1p+p5pn [0,1,4,5,7,8,10] SAME AS ABOVE
// scale = edo.scale([0,1,3,4,6,8,10]) //1n+p5pn [0,2,4,5,7,8,10] SAME AS BELOW
// scale = edo.scale([0,1,3,4,6,8,10]) //1n+l5nn [0,2,4,6,7,9,10] SAME AS ABOVE
// scale = edo.scale([0,1,3,5,6,8,9]) //1p+p5nn [0,1,4,5,7,9,10] SAME AS BELOW
// scale = edo.scale([0,1,3,5,6,8,9]) //1n+p5pl [0,2,4,5,7,8,11] SAME AS ABOVE
// scale = edo.scale([0,1,3,5,6,8,10]) //1n+l5nl [0,2,4,6,7,9,11] SAME AS BELOW
// scale = edo.scale([0,1,3,5,6,8,10]) //1n+p5nn [0,2,4,5,7,9,10] SAME AS BELOW
// scale = edo.scale([0,1,3,5,6,8,10]) //1n+p5nl [0,2,4,5,7,9,11] SAME AS ABOVE
// scale = edo.scale([0,1,3,5,7,8,9]) //1p+p5nl [0,1,4,5,7,9,11] SAME AS BELOW
// scale = edo.scale([0,1,3,5,7,8,9]) //1n+l5pl [0,2,4,6,7,8,11] SAME AS ABOVE
// scale = edo.scale([0,2,3,4,6,8,9]) //1p+l5pn [0,1,4,6,7,8,10]
// scale = edo.scale([0,2,3,4,7,8,9]) //1p+l5pl [0,1,4,6,7,8,11]
// scale = edo.scale([0,2,3,5,6,8,9]) //1p+l5nn [0,1,4,6,7,9,10]
// scale = edo.scale([0,2,3,5,7,8,9]) //1p+l5nl [0,1,4,6,7,9,11]
// scale = edo.scale([0,3,4,6,7,8,11]) //1l+l5pl [0,3,4,6,7,8,11]


/*
All 6-NOTE SCALES (with no 2 consecutive semitones):
*/

scale = edo.scale([0,1,3,4,6,7]) //Contains big gap, feels disproportional
scale = edo.scale([0,1,3,4,6,8]) //Contains big gap, feels disproportional
scale = edo.scale([0,1,3,4,6,9]) //Contains big gap, feels disproportional
scale = edo.scale([0,1,3,4,7,8]) //Interesting
scale = edo.scale([0,1,3,4,7,9]) //Interesting
scale = edo.scale([0,1,3,5,6,8]) //Contains big gap, feels disproportional
scale = edo.scale([0,1,3,5,6,9]) //Interesting
scale = edo.scale([0,1,3,5,7,8]) //boring
scale = edo.scale([0,1,3,5,7,9]) // Interesting
scale = edo.scale([0,1,3,6,7,9]) //MOLT, worth exploring
scale = edo.scale([0,1,4,5,7,8]) //Interesting
scale = edo.scale([0,1,4,5,7,9]) // Interesting
scale = edo.scale([0,1,4,5,8,9]) //Interesting
scale = edo.scale([0,1,4,6,7,9]) //boring
scale = edo.scale([0,2,3,5,6,8]) //Contains big gap, feels disproportional
scale = edo.scale([0,2,3,5,6,9]) // Interesting
scale = edo.scale([0,2,3,5,7,8]) //boring
scale = edo.scale([0,2,3,5,7,9]) //Okay
scale = edo.scale([0,2,3,6,7,9]) //Interesting
scale = edo.scale([0,2,3,6,8,9]) //MOLT, all modes worth exploring.
scale = edo.scale([0,2,4,5,7,8]) //Contains big gap, feels disproportional
scale = edo.scale([0,2,4,5,7,9]) //boring, but has a 6-tone "pentatonic" quality
scale = edo.scale([0,2,4,5,8,9]) //Interesting
scale = edo.scale([0,2,4,6,7,9]) //Nice modes, all are bright and diatonicy
scale = edo.scale([0,2,4,6,8,9]) //Interesting
scale = edo.scale([0,2,4,6,8,10]) //Whole Tones





/*
Other 6-NOTE SCALES of interest:
*/

// scale = edo.scale([0, 2, 3, 6, 7, 11]) // this may be the mode of another
// scale = edo.scale([0, 2, 3, 6, 8, 11]) // this may be the mode of another
// scale = edo.scale([0, 2, 4, 6, 8, 11]) // this may be the mode of another
// scale = edo.scale([0, 3, 6, 7, 8, 11])











/*
All 5-NOTE SCALES (with no 2 consecutive semitones):
*/

// scale = edo.scale([0,1,3,4,6])
// scale = edo.scale([0,1,3,4,7])
// scale = edo.scale([0,1,3,4,8])
// scale = edo.scale([0,1,3,5,6])
// scale = edo.scale([0,1,3,5,7])
// scale = edo.scale([0,1,3,5,8])
// scale = edo.scale([0,1,3,6,7])
// scale = edo.scale([0,1,3,6,8])
// scale = edo.scale([0,1,3,6,9])
// scale = edo.scale([0,1,4,5,7])
// scale = edo.scale([0,1,4,5,8])
// scale = edo.scale([0,1,4,6,7])
// scale = edo.scale([0,1,4,6,8])
// scale = edo.scale([0,1,4,6,9])
// scale = edo.scale([0,1,4,7,8])
// scale = edo.scale([0,1,5,6,8])
// scale = edo.scale([0,2,3,5,6])
// scale = edo.scale([0,2,3,5,7])
// scale = edo.scale([0,2,3,5,8])
// scale = edo.scale([0,2,3,6,7])
// scale = edo.scale([0,2,3,6,8])
// scale = edo.scale([0,2,3,6,9])
// scale = edo.scale([0,2,3,7,8])
// scale = edo.scale([0,2,4,5,7])
// scale = edo.scale([0,2,4,5,8])
// scale = edo.scale([0,2,4,6,7])
// scale = edo.scale([0,2,4,6,8])
// scale = edo.scale([0,2,4,6,9])
// scale = edo.scale([0,2,4,7,8])
// scale = edo.scale([0,2,4,7,9])
// scale = edo.scale([0,2,5,6,8])
// scale = edo.scale([0,2,5,6,9])
// scale = edo.scale([0,2,5,7,8])
// scale = edo.scale([0,3,4,6,7])
// scale = edo.scale([0,3,4,6,8])
// scale = edo.scale([0,3,4,7,8])
// scale = edo.scale([0,3,5,6,8])
// scale = edo.scale([0,3,5,7,8])



/*
* All Modes of Limited Transposition
* */
// scale = edo.scale([0,1,2,3,4,5,6,7,8,9,10,11])
// scale = edo.scale([0,1,2,3,4,6,7,8,9,10])
// scale = edo.scale([0,1,2,3,6,7,8,9])
// scale = edo.scale([0,1,2,4,6,7,8,10])
// scale = edo.scale([0,1,2,6,7,8])
// scale = edo.scale([0,1,2,4,5,6,8,9,10])
// scale = edo.scale([0,1,3,4,6,7,9,10])
// scale = edo.scale([0,1,3,6,7,9])
// scale = edo.scale([0,1,4,5,8,9])
// scale = edo.scale([0,1,4,6,7,10])
// scale = edo.scale([0,1,6,7])
// scale = edo.scale([0,2,4,6,8,10])
// scale = edo.scale([0,2,6,8])
// scale = edo.scale([0,3,6,9])
// scale = edo.scale([0,4,8])
// scale = edo.scale([0,6])


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

console.log('\nSUBSETS THAT ARE <NOT> MOLT')
let subsets = scale.parent.get.subsets(scale.pitches,true,true)
subsets = subsets
    .map((subset)=>edo.scale(subset)) //to scale Object
    .filter((subset)=>subset.count.transpositions()==12) // Filter MOLT out
    .map((subset)=>subset.pitches) // get pitches
    .forEach((subset)=>console.log("Subset:",subset,"Can be constructed on the following PCs:",scale.get.position_of_quality(subset)))

console.log('\nSUBSETS THAT <ARE> MOLT')
subsets = scale.parent.get.subsets(scale.pitches,true,true)
subsets = subsets
    .map((subset)=>edo.scale(subset)) //to scale Object
    .filter((subset)=>subset.count.transpositions()!=12) // Filter MOLT out
    .map((subset)=>subset.pitches) // get pitches
    .forEach((subset)=>console.log("Subset:",subset,"Can be constructed on the following PCs:",scale.get.position_of_quality(subset)))
