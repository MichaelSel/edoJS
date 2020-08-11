function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
const EDO = require("../edo").EDO
let edo = new EDO(12)
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






let midi = edo.midi.import('midi/Bach - Prelude1.mid')
midi = edo.midi.strip(midi).map(n=>(Array.isArray(n))?n[0]:n)
console.log(midi.join(" "))