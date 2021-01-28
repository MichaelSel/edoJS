// function getRandomInt(min, max) {
//     min = Math.ceil(min);
//     max = Math.floor(max);
//     return Math.floor(Math.random() * (max - min + 1)) + min;
// }
const EDO = require("../edo").EDO
const Time = require("../edo").Time
// // let edo = new EDO(12)
// // let chords = [[0,4,6,8,11],[1,3,6,7,11],[1,4,5,9,11],[3,5,7,10,11]]
// // chords = edo.get.permutations(chords)
// // chords.forEach((coll)=>{
// //     console.log("collection:")
// //     let chord1 = coll.splice(0,1)[0]
// //     console.log(chord1)
// //     while(coll.length>0) {
// //         chord2 = coll.splice(0,1)[0]
// //         chord1 = edo.get.minimal_voice_leading(chord1,chord2)
// //         console.log(chord1)
// //     }
// //     console.log('\n')
// // })
// // let sets
// // sets = edo.get.partitioned_subsets([0,[1,2],[3,4],[5,6],7,[8,9],[10,11],0])
// // sets = edo.get.partitioned_subsets([0,[1,2],[3,4],7,[8,9],0])
// // sets = edo.get.partitioned_subsets([0,[3,4],[5,6],[7,8],[10,11]])
// // sets = edo.get.partitioned_subsets([[0],[4,3],[2,3],[8,9],[10,11],7,[3,4]])
// //
// // sets.forEach((set)=>{
// //     console.log(JSON.stringify(set))
// // })
// //
// //
//
// // let motives = edo.get.contour_motives([6,5,6,3,6,8,6,1,3],)
// // motives.forEach((motive)=>console.log(JSON.stringify(motive)))
//
// // let ngrams = edo.get.ngrams([4,4,5,7,7,5,4,2,0,0,2,4,4,2,4,4,5,7,7,5,4,2,0,0,2,4,2,0,2,4,0,2,4,5,4,0,2,4,5,4,2,0,2,-5],5)
// // console.log(edo.get.random_melody_from_ngram(ngrams,[0]))
//
// // let dist = edo.get.pitch_distribution([4,4,5,7,7,5,4,2,0,0,2,4,4,2,4,4,5,7,7,5,4,2,0,0,2,4,2,0,2,4,0,2,4,5,4,0,2,4,5,4,2,0,2,-5])
// // console.log(edo.get.random_melody_from_distribution(dist))
//
//
// // let ngrams = edo.get.ngrams([4,4,5,7,7,5,4,2,0,0,2,4,4,2,2])
// // let np = edo.get.pitch_fields([8,7,7,8,7,7,8,7,7,15,15,14,12,12,10,8,8,7,5,5])
// // np = np.map((notes,i)=>{
// //     if(i==0) return notes
// //     return edo.get.without(notes,np[i-1])
// // })
// // console.log(np);
//
// // let perms = edo.get.permutations([0,2,4,5,7,9,11]).map(p=>p.slice(0,3))
// // let perm_ang = []
// // perms=edo.get.unique_elements(perms).filter(a=>a[0]<a[2])
// // perms.forEach(p=>{
// //     perm_ang.push([p,edo.get.angle(p)])
// // })
// // perm_ang = perm_ang.sort((a,b)=>a[1]-b[1])
// // perm_ang.forEach(p=>{
// //     console.log(p)
// // })
//
//
//
//
//
//
// // let midi = edo.midi.import('midi/Beethoven - Symphony 5-1.mid')
// // let beethoven = edo.midi.chordify(midi,960,true,false,true)
// // console.log(edo.convert.midi_to_name(beethoven))
// //
// // midi = edo.midi.strip(midi)
// // console.log(midi)
//
// // let edo24=new EDO(24)
// // edo24.get.scales(1,12,1,3)
// //     .filter(scale=>scale.count.transpositions()<24)
// //     .forEach(scale=>console.log(scale.pitches))
//
//
// // let scale = edo.scale([0,2,4,5,7,9,11])
// // let shape = [1,3,5]
// // let progression = [1,[5,5],5,1].map(el=>{
// //     (!Number.isNaN(el))
// // })
// // let of = 2
// // let chord = scale.get.chord_quality_from_shape(shape,5)
// // console.log(edo.get.transposition(chord,scale.pitches[of-1]))
//
// // let scale = edo.scale([0,2,4,6,8,9,11])
// // let scales = []
// // for (let i = 0; i < 12; i++) {
// //     let transposition = scale.get.transposition(i)
// //     let ct = edo.count.common_tones(scale.pitches,transposition)
// //     scales.push([transposition,ct])
// // }
// // scales = scales.sort((a,b)=>b[1]-a[1]).forEach(scale=>console.log(scale))
//
//
// // console.log(edo.get.pitch_fields([8,7,7,8,7,7,8,7,7,15,15,14,12,12,10,8,8,7,5,5],5,false,true,true))
//
// // console.log(edo.convert.pc_to_name([1,2,3,[4,5,[6,7,8,15]]]))
//
// let time = new Time()
// // console.log(time.convert.beats_to_ratios([2,2,4,2,2,4,3,3,6,2,2,4]))
// // console.log(time.get.relational_motives([2,2,4,2,2,4,3,3,6,3]))
// // console.log(time.get.motives([2,2,4,2,2,4,3,3,6,3]))
// //
// // let sub = time.get.subdivisions(12)
// // let rhythms = time.get.explicit(...sub)
// // rhythms.forEach(r=>console.log(JSON.stringify(r)))
// // let gati = 4
// // let jathi = 3
// // let cycle = 4*gati
// // let t = time.get.counterpoint_cycle(gati, jathi, cycle)
// // t.forEach(e=>console.log(JSON.stringify(e)))
//
//
//
// // let scale= edo.scale([0,2,3,5,6,8,9,11])
// // let scales = scale.parent.get.subsets(scale.pitches,true,true)
// // scales = edo.get.unique_elements(scales)
// //     .map(s=>edo.scale(s))
// //     .filter(s=>s.count.pitches()>5)
// // scales.forEach(s=>console.log(JSON.stringify(s.pitches)))
//
//
// // let itr = edo.convert.interval_to_ratio
// //
// // // console.log(edo.get.modes([0,4,7]))
// //
// // console.log(edo.get.dissonance_measure(itr([0,0+12,7+12,4+24])))
// // console.log(edo.get.dissonance_measure([1,2,3,4,5,6,7,8]))
//
//
// // let a = time.get.subdivisions(7)
// //     .filter(b=>b.length==3)
// //     .forEach(b=>edo.get.unique_elements(edo.get.rotations(b)).forEach(p=>console.log(JSON.stringify(p))))
//
//
//
//
//
// // let piece = edo.midi.import('./midi/syrinx.mid')
// // piece = edo.midi.strip(piece).map(n=>(Array.isArray(n))?n[0]:n)
// // console.log(edo.get.pitch_fields(piece,5,true,true,true).map(q=>edo.get.normal_order(q)))
//
//
// // scale = edo.scale([0,2,4,7,9])
// // console.log(scale.get.scale_degree_roles())
//
//
// // scale = edo.scale([0,2,4,6,9])
// // let tonal_interpretations = 0
// // for (let i = 0; i < scale.count.pitches(); i++) {
// //     let possibilities = scale.mode(i).get.scale_degree_roles()
// //         .filter(r=>edo.get.unique_elements(r).length==scale.count.pitches())
// //         .filter(r=>{
// //             let v1 = [...r].sort((a,b)=>a-b)
// //             return edo.is.same(v1,r)
// //         })
// //         .filter(r=>{
// //             return (r.indexOf(3)!=-1 && r.indexOf(5)!=0)
// //         })
// //
// //     if(possibilities.length>0) tonal_interpretations++
// // }
// //
// // console.log(tonal_interpretations)
//
// // let diatonic = edo.scale([0,2,4,5,7,9,11]) //
// // let harmonicm = edo.scale([0,2,3,5,7,8,11]) //
// // let melodicm = edo.scale([0,2,3,5,7,9,11]) //
// // let all_diatonic = []
// // let all_harmonicm = []
// // let all_melodicm = []
// // for (let i = 0; i < 12; i++) {
// //     all_diatonic.push(diatonic.get.transposition(i).sort((a,b)=>a-b))
// //     all_harmonicm.push(harmonicm.get.transposition(i).sort((a,b)=>a-b))
// //     all_melodicm.push(melodicm.get.transposition(i).sort((a,b)=>a-b))
// // }
// //
// //
// // scale = edo.scale([0,2,4,5,7])
// //
// // let total_diatonic = all_diatonic.map(t=>edo.is.subset(scale.pitches,t)).filter(t=>t).length
// // let total_harmonicm = all_harmonicm.map(t=>edo.is.subset(scale.pitches,t)).filter(t=>t).length
// // let total_melodicm = all_melodicm.map(t=>edo.is.subset(scale.pitches,t)).filter(t=>t).length
// // console.log(total_diatonic,total_harmonicm,total_melodicm)
//
// // edo = new EDO()
// // scales = edo.get.scales().filter(s=>s.count.pitches()==5)
// // scales.forEach(scale=>console.log(scale.pitches,scale.get.myhill_property()))
//
// // let edo = new EDO(12)
// // console.log(edo.get.harp_position_of_quality([0,1,2,3,4]))
//
// // let edo = new EDO(24)
// // console.log(edo.get.harp_position_of_quality([0,8,14,19,4,11],[0,3,8,11,14,18,22],[-2,0,2])) //maj79E
// // console.log(edo.get.harp_position_of_quality([0,3,6,9,12],[0,3,8,11,14,18,22],[-2,0,2])) // 3/4 tone pentachord
// // console.log(edo.get.harp_position_of_quality([0,3,6,14],[0,3,8,11,14,18,22],[-2,0,2])) //min~9
// // console.log(edo.get.harp_position_of_quality([0,1,7,8],[0,3,8,11,14,18,22],[-2,0,2]))
// // console.log(edo.get.harp_position_of_quality([0,2,4,6],[0,3,8,11,14,18,22],[-2,0,2])) //Chromatic tetrachord
// // console.log(edo.get.harp_position_of_quality([0,1,2],[0,3,8,11,14,18,22],[-2,0,2])) //microtonal trichord
// // console.log(edo.get.harp_position_of_quality([0,4,8,12,16,19],[0,3,8,11,14,18,22],[-2,0,2])) //whole-tone pentachord + 3/4
// // console.log(edo.get.harp_position_of_quality([0,4,8,11,14],[0,3,8,11,14,18,22],[-2,0,2])) //overtone lydian
// // console.log(edo.get.harp_position_of_quality([20,0,4,8,11,14],[0,3,8,11,14,18,22],[-2,0,2])) //wholetone + overtone lydian
// // console.log(edo.get.harp_position_of_quality([17,20,0,4,8,11,14],[0,3,8,11,14,18,22],[-2,0,2])) //wholetone + overtone lydian variation
// // console.log(edo.get.harp_position_of_quality([0,4,8,11,14,18,19],[0,3,8,11,14,18,22],[-2,0,2])) //Overtone scale
// // console.log(edo.get.harp_position_of_quality([1,4,8,12,16,20],[0,3,8,11,14,18,22],[-2,0,2])) // 3/4 + whole-tone pentachord
// // console.log(edo.get.harp_position_of_quality([0,1,5,12,13,17],[0,3,8,11,14,18,22],[-2,0,2])) //MOLT
// // console.log(edo.get.harp_position_of_quality([0,1,6,12,13,18],[0,3,8,11,14,18,22],[-2,0,2])) //MOLT
// // console.log(edo.get.harp_position_of_quality([0,4,5,12,16,17],[0,3,8,11,14,18,22],[-2,0,2])) //MOLT
// // console.log(edo.get.harp_position_of_quality([0,5,6,12,17,18],[0,3,8,11,14,18,22],[-2,0,2])) //MOLT
// // console.log(edo.get.harp_position_of_quality([0,5,12,17],[0,3,8,11,14,18,22],[-2,0,2])) //MOLT
// // console.log(edo.get.harp_position_of_quality([0,3,7,11,15,18],[0,3,8,11,14,18,22],[-2,0,2])) //3/4+wholetone sextachord
//
//
//
//
//
// let edo = new EDO()
// // edo.get.permutations("said she stole my".split(' ')).map(p=>console.log("I never " + p.join(" ") + " money"))
//
// // words = ["I never said she stole your money","I never said she your stole money","I never said stole she your money","I never said stole your she money","I never said your she stole money","I never said your stole she money","I never she said stole your money","I never she said your stole money","I never she stole said your money","I never she stole your said money","I never she your said stole money","I never she your stole said money","I never stole said she your money","I never stole said your she money","I never stole she said your money","I never stole she your said money","I never stole your said she money","I never stole your she said money","I never your said she stole money","I never your said stole she money","I never your she said stole money","I never your she stole said money","I never your stole said she money","I never your stole she said money"]
// // edo.shuffle_array(words).forEach(sen=>console.log(sen))
//
//
// // words = "ne ver sed shi stol may ma"
// // words = words.split(' ')
// // for (let i = 0; i < 7*4; i++) {
// //     console.log("Ay " +edo.shuffle_array(words).join(" ") + " ni")
// // }
//
// // let scale = edo.scale([0,2,4,5,7,9,11])
// //
// // let scales = edo.get.scales()
// // let scales7 = scales.filter(scl=>scl.count.pitches()==7)
// // scales7 = scales7.sort((a,b)=>b.get.coherence_quotient()-a.get.coherence_quotient())
// // scales7.forEach(scale=>{
// //     console.log(scale.get.coherence_quotient(),scale.get.area())
// //     console.log(JSON.stringify(scale.get.pitches()))
// // })
//
//
//
//
//
// let intervals = [5,5,5,5,6,6,6,1]
// for (let i = 0; i < 10; i++) {
//     let temp_int = intervals.map(i=>(Math.round(Math.random())==0)?i:-i)
//     temp_int = edo.shuffle_array(temp_int)
//
//     console.log(edo.convert.intervals_to_pitches(temp_int))
//
// }
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//


edo = new EDO(12)
// let scales = edo.get.scales(1,12,1,7,5).filter(scale=>scale.count.pitches()==5)
// scales.forEach(scale=>{
//     console.log(JSON.stringify(scale.pitches))
// })

// let scales = edo.get.scales().filter(scale=>scale.count.pitches()==5)
// scales.forEach(scale=>console.log("Set:",scale.pitches,"Neighborhood:", JSON.stringify(scale.get.neighborhood())))






// let scales = edo.get.scales().filter(scale=>scale.count.pitches()==7)
// scales.forEach(scale=>{
//     let modes = []
//     for (let i = 0; i < scale.pitches.length; i++) {
//         modes.push(scale.mode(i))
//     }
//     modes=modes.filter((mode)=>{
//         let roles = mode.get.scale_degree_roles()
//         // console.log(mode.pitches,edo.is.element_of([1,2,3,4,5,6,7],roles))
//         return edo.is.element_of([1,2,3,4,5,6,7],roles)
//     }).map(m=>{
//         return {
//             pitches:m.pitches,
//             alterations: m.get.set_difference().alterations
//         }
//     })
//
//
//
//     // let alterations = modes.map(mode=>mode.get.set_difference()).sort((a,b)=>a.alterations-b.alterations)[0]
//     // if(alterations) console.log(alterations.alterations)
//     // else console.log(6)
//     // console.log("SET:",JSON.stringify(scale.pitches))
//     let total_alterations = (7-modes.length)*6
//     modes.forEach(mode=>total_alterations+=mode.alterations)
//     // console.log(scale.get.coherence_quotient())
//     console.log(scale.get.coherence_quotient())
// })


// let scales = edo.get.scales().filter(scale=>scale.count.pitches()==5)
// scales.forEach(scale=>{
//     let modes = []
//     for (let i = 0; i < scale.pitches.length; i++) {
//         modes.push(scale.mode(i))
//     }
//     modes=modes.filter((mode)=>{
//         let roles = mode.get.scale_degree_roles()
//         roles = roles.map(r=>{
//             r = r.map(set=>{
//                 let temp_set = new Set()
//                 r.forEach(el=>temp_set.add(el))
//                 return Array.from(temp_set)
//             })
//             r = r.filter(con=>con.length==5)
//             r=r.filter(con=>con.indexOf(5)!=-1)
//             return r
//         })
//         roles = roles.filter(arr=>arr.length>0)
//         return roles.length>0
//     })
//
//     console.log("SET:",JSON.stringify(scale.pitches),"mappable modes:",modes.length)
// })



let scales_all=edo.get.scales()
let scales7=scales_all.filter(scale=>scale.count.pitches()==7)
    // .sort((a,b)=>b.get.coherence_quotient()-a.get.coherence_quotient())
let scales5=scales_all.filter(scale=>scale.count.pitches()==5)
//
// scales5.map(scale=>{
//     let parent
//     loop1:
//     for (let i = 0; i < scales7.length; i++) {
//         loop2:
//         for (let j = 0; j < scales7[i].count.pitches(); j++) {
//             if(edo.is.subset(scale.pitches,scales7[i].mode(j).pitches)) {
//                 parent = scales7[i]
//                 break loop1
//             }
//         }
//
//     }
//     scale.closest = parent
//     console.log(JSON.stringify(parent.get.coherence_quotient()))
//     return scale
// })


const stability_vector = function (pitches) {
    let ratios = pitches.map(p=>edo.convert.interval_to_ratio(p))
    let vector = pitches.map(p=>0)
    vector[0]='*'
    let closest_P5=0
    let P5_tol = 10
    let P5 = 3/2

    let closest_M3=0
    let M3_tol = 15
    let M3 = 5/4

    let closest_m3=0
    let m3_tol = 20
    let m3 = 6/5


    ratios.forEach(r=>{
        let diff = Math.abs(P5-r)
        if(diff<Math.abs(P5-closest_P5)) {
            closest_P5= r
        }

        diff = Math.abs(M3-r)
        if(diff<Math.abs(M3-closest_M3)) {
            closest_M3= r
        }
    })
    if(Math.abs(edo.convert.ratio_to_cents(P5) - edo.convert.ratio_to_cents(closest_P5))>P5_tol) {}
    else {
        let ind = ratios.indexOf(closest_P5)
        vector[ind]="*"
    }



    if(Math.abs(edo.convert.ratio_to_cents(M3) - edo.convert.ratio_to_cents(closest_M3))>M3_tol){
        ratios.forEach(r=>{
            diff = Math.abs(m3-r)
            if(diff<Math.abs(m3-closest_m3)) {
                closest_m3= r
            }
        })
        if(Math.abs(edo.convert.ratio_to_cents(m3) - edo.convert.ratio_to_cents(closest_m3))>m3_tol) {

        }
        else {
            let ind = ratios.indexOf(closest_m3)
            vector[ind]="*"
        }


    } else {
        let ind = ratios.indexOf(closest_M3)
        vector[ind]="*"
    }
    for (let i = 0; i < vector.length; i++) {
        if(vector[i]=="*") continue
        else if(vector[i-1]=="*" && vector[(i+1)%vector.length]=="*") vector[i]="<>"
        else if(vector[i-1]=="*" && vector[(i+1)%vector.length]!="*") vector[i]="<<"
        else if(vector[i-1]!="*" && vector[(i+1)%vector.length]=="*") vector[i]=">>"
        else vector[i]="!"
    }
    return vector
}
scales7.forEach(scale=>{
    // let vec = stability_vector(scale.pitches)
    // console.log(JSON.stringify(scale.pitches),JSON.stringify(vec),"Mappable:", vec.indexOf("!")==-1)

})

let diatonic = edo.scale([0,2,4,5,7,9,11])
// console.log(diatonic.mode(0).get.per_note_set_difference())


scales7.forEach(scale=>{
//     // let unique = 0
//     // for (let i = 0; i < scale.count.pitches(); i++) {
//     //     unique += scale.mode(i).count.unique_elements([0,2,4,5,7,9,11])
//     // }
//     // console.log(unique)
//
//     // let mappable = 0
//     // for (let i = 0; i < scale.count.pitches(); i++) {
//     //     let mode = scale.mode(i)
//     //     let roles = mode.get.scale_degree_roles()
//     //     if(edo.is.element_of([1,2,3,4,5,6,7],roles)) mappable++
//     //     console.log()
//     // }
//     // console.log(mappable)
//
//     // let ambigious = 0
//     // for (let i = 0; i < scale.count.pitches(); i++) {
//     //     let mode = scale.mode(i)
//     //     let vector = stability_vector( mode.pitches)
//     //     if(vector.indexOf('!')!=-1) ambigious++
//     //
//     // }
//     // console.log(ambigious)
//
//     console.log(scale.get.coherence_quotient())
//
//

    let modes = scale.pitches.map((s,i)=>scale.mode(i))
    let deltas = modes.map(m=>m.get.per_note_set_difference().reduce((ag,el)=>(el!=0)?ag+1:ag,0))
    let smallest_delta = Math.min(...deltas)
    console.log(smallest_delta)
})





