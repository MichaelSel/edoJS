function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
const EDO = require("../edo").EDO
const Time = require("../edo").Time
// let edo = new EDO(12)
// let chords = [[0,4,6,8,11],[1,3,6,7,11],[1,4,5,9,11],[3,5,7,10,11]]
// chords = edo.get.permutations(chords)
// chords.forEach((coll)=>{
//     console.log("collection:")
//     let chord1 = coll.splice(0,1)[0]
//     console.log(chord1)
//     while(coll.length>0) {
//         chord2 = coll.splice(0,1)[0]
//         chord1 = edo.get.minimal_voice_leading(chord1,chord2)
//         console.log(chord1)
//     }
//     console.log('\n')
// })
// let sets
// sets = edo.get.partitioned_subsets([0,[1,2],[3,4],[5,6],7,[8,9],[10,11],0])
// sets = edo.get.partitioned_subsets([0,[1,2],[3,4],7,[8,9],0])
// sets = edo.get.partitioned_subsets([0,[3,4],[5,6],[7,8],[10,11]])
// sets = edo.get.partitioned_subsets([[0],[4,3],[2,3],[8,9],[10,11],7,[3,4]])
//
// sets.forEach((set)=>{
//     console.log(JSON.stringify(set))
// })
//
//

// let motives = edo.get.contour_motives([6,5,6,3,6,8,6,1,3],)
// motives.forEach((motive)=>console.log(JSON.stringify(motive)))

// let ngrams = edo.get.ngrams([4,4,5,7,7,5,4,2,0,0,2,4,4,2,4,4,5,7,7,5,4,2,0,0,2,4,2,0,2,4,0,2,4,5,4,0,2,4,5,4,2,0,2,-5],5)
// console.log(edo.get.random_melody_from_ngram(ngrams,[0]))

// let dist = edo.get.pitch_distribution([4,4,5,7,7,5,4,2,0,0,2,4,4,2,4,4,5,7,7,5,4,2,0,0,2,4,2,0,2,4,0,2,4,5,4,0,2,4,5,4,2,0,2,-5])
// console.log(edo.get.random_melody_from_distribution(dist))


// let ngrams = edo.get.ngrams([4,4,5,7,7,5,4,2,0,0,2,4,4,2,2])
// let np = edo.get.pitch_fields([8,7,7,8,7,7,8,7,7,15,15,14,12,12,10,8,8,7,5,5])
// np = np.map((notes,i)=>{
//     if(i==0) return notes
//     return edo.get.without(notes,np[i-1])
// })
// console.log(np);

// let perms = edo.get.permutations([0,2,4,5,7,9,11]).map(p=>p.slice(0,3))
// let perm_ang = []
// perms=edo.get.unique_elements(perms).filter(a=>a[0]<a[2])
// perms.forEach(p=>{
//     perm_ang.push([p,edo.get.angle(p)])
// })
// perm_ang = perm_ang.sort((a,b)=>a[1]-b[1])
// perm_ang.forEach(p=>{
//     console.log(p)
// })






// let midi = edo.midi.import('midi/Beethoven - Symphony 5-1.mid')
// let beethoven = edo.midi.chordify(midi,960,true,false,true)
// console.log(edo.convert.midi_to_name(beethoven))
//
// midi = edo.midi.strip(midi)
// console.log(midi)

// let edo24=new EDO(24)
// edo24.get.scales(1,12,1,3)
//     .filter(scale=>scale.count.transpositions()<24)
//     .forEach(scale=>console.log(scale.pitches))


// let scale = edo.scale([0,2,4,5,7,9,11])
// let shape = [1,3,5]
// let progression = [1,[5,5],5,1].map(el=>{
//     (!Number.isNaN(el))
// })
// let of = 2
// let chord = scale.get.chord_quality_from_shape(shape,5)
// console.log(edo.get.transposition(chord,scale.pitches[of-1]))

// let scale = edo.scale([0,2,4,6,8,9,11])
// let scales = []
// for (let i = 0; i < 12; i++) {
//     let transposition = scale.get.transposition(i)
//     let ct = edo.count.common_tones(scale.pitches,transposition)
//     scales.push([transposition,ct])
// }
// scales = scales.sort((a,b)=>b[1]-a[1]).forEach(scale=>console.log(scale))


// console.log(edo.get.pitch_fields([8,7,7,8,7,7,8,7,7,15,15,14,12,12,10,8,8,7,5,5],5,false,true,true))

// console.log(edo.convert.pc_to_name([1,2,3,[4,5,[6,7,8,15]]]))

let time = new Time()
// console.log(time.convert.beats_to_ratios([2,2,4,2,2,4,3,3,6,2,2,4]))
// console.log(time.get.relational_motives([2,2,4,2,2,4,3,3,6,3]))
// console.log(time.get.motives([2,2,4,2,2,4,3,3,6,3]))
//
// let sub = time.get.subdivisions(12)
// let rhythms = time.get.explicit(...sub)
// rhythms.forEach(r=>console.log(JSON.stringify(r)))
// let gati = 4
// let jathi = 3
// let cycle = 4*gati
// let t = time.get.counterpoint_cycle(gati, jathi, cycle)
// t.forEach(e=>console.log(JSON.stringify(e)))



// let scale= edo.scale([0,2,3,5,6,8,9,11])
// let scales = scale.parent.get.subsets(scale.pitches,true,true)
// scales = edo.get.unique_elements(scales)
//     .map(s=>edo.scale(s))
//     .filter(s=>s.count.pitches()>5)
// scales.forEach(s=>console.log(JSON.stringify(s.pitches)))


// let itr = edo.convert.interval_to_ratio
//
// // console.log(edo.get.modes([0,4,7]))
//
// console.log(edo.get.dissonance_measure(itr([0,0+12,7+12,4+24])))
// console.log(edo.get.dissonance_measure([1,2,3,4,5,6,7,8]))


// let a = time.get.subdivisions(7)
//     .filter(b=>b.length==3)
//     .forEach(b=>edo.get.unique_elements(edo.get.rotations(b)).forEach(p=>console.log(JSON.stringify(p))))





// let piece = edo.midi.import('./midi/syrinx.mid')
// piece = edo.midi.strip(piece).map(n=>(Array.isArray(n))?n[0]:n)
// console.log(edo.get.pitch_fields(piece,5,true,true,true).map(q=>edo.get.normal_order(q)))


// scale = edo.scale([0,2,4,7,9])
// console.log(scale.get.scale_degree_roles())


// scale = edo.scale([0,2,4,6,9])
// let tonal_interpretations = 0
// for (let i = 0; i < scale.count.pitches(); i++) {
//     let possibilities = scale.mode(i).get.scale_degree_roles()
//         .filter(r=>edo.get.unique_elements(r).length==scale.count.pitches())
//         .filter(r=>{
//             let v1 = [...r].sort((a,b)=>a-b)
//             return edo.is.same(v1,r)
//         })
//         .filter(r=>{
//             return (r.indexOf(3)!=-1 && r.indexOf(5)!=0)
//         })
//
//     if(possibilities.length>0) tonal_interpretations++
// }
//
// console.log(tonal_interpretations)

// let diatonic = edo.scale([0,2,4,5,7,9,11]) //
// let harmonicm = edo.scale([0,2,3,5,7,8,11]) //
// let melodicm = edo.scale([0,2,3,5,7,9,11]) //
// let all_diatonic = []
// let all_harmonicm = []
// let all_melodicm = []
// for (let i = 0; i < 12; i++) {
//     all_diatonic.push(diatonic.get.transposition(i).sort((a,b)=>a-b))
//     all_harmonicm.push(harmonicm.get.transposition(i).sort((a,b)=>a-b))
//     all_melodicm.push(melodicm.get.transposition(i).sort((a,b)=>a-b))
// }
//
//
// scale = edo.scale([0,2,4,5,7])
//
// let total_diatonic = all_diatonic.map(t=>edo.is.subset(scale.pitches,t)).filter(t=>t).length
// let total_harmonicm = all_harmonicm.map(t=>edo.is.subset(scale.pitches,t)).filter(t=>t).length
// let total_melodicm = all_melodicm.map(t=>edo.is.subset(scale.pitches,t)).filter(t=>t).length
// console.log(total_diatonic,total_harmonicm,total_melodicm)

// edo = new EDO()
// scales = edo.get.scales().filter(s=>s.count.pitches()==5)
// scales.forEach(scale=>console.log(scale.pitches,scale.get.myhill_property()))


let edo = new EDO(12)
// console.log(edo.get.harp_configurations(true))
console.log(edo.get.rotated([0,2,4,5,7],-1))
































