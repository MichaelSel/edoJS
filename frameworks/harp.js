#!/usr/bin/env node --max-old-space-size=4096

const EDO = require("../edo").EDO

let edo = new EDO(24)

let parker1 = [0,3,8,11,14,18,22]
let parker2 = [0,5,8,9,14,18,22]
let harmonic_on_G = [1,4,8,9,14,18,22]
let harmonic_on_F = [0,5,8,10,14,18,21]
let scordatura = harmonic_on_G

// console.log(edo.get.harp_position_of_quality([0,3,6,14],scordatura,[-2,0,2])) //min~9
// console.log(edo.get.harp_position_of_quality([0,1,7,8],scordatura,[-2,0,2])) // 1/4,min3, 1/4
// console.log(edo.get.harp_position_of_quality([0,1,9,10],scordatura,[-2,0,2])) // 1/4, maj3, 1/4




// console.log(edo.get.harp_position_of_quality([0,8,14,19,4,11],scordatura,[-2,0,2])) //maj79E
// console.log(edo.get.harp_position_of_quality([0,3,6,9,12],scordatura,[-2,0,2])) // 3/4 tone pentachord
// console.log(edo.get.harp_position_of_quality([0,4,8,11,14],scordatura,[-2,0,2])) //overtone lydian
// console.log(edo.get.harp_position_of_quality([0,4,8,11,14,18,19],scordatura,[-2,0,2])) //Overtone scale
// console.log(edo.get.harp_position_of_quality([0,4,8,11,14,16,21],scordatura,[-2,0,2])) //Cool scale

// console.log(edo.get.harp_position_of_quality([0,1,2],scordatura,[-2,0,2])) //microtonal trichord
// console.log(edo.get.harp_position_of_quality([0,4,7,11,14,18],scordatura,[-2,0,2])) // 1, 3/4, 1, 3/4, 1 ****
// console.log(edo.get.harp_position_of_quality([0,3,6,9,12],scordatura,[-2,0,2])) // 3/4 pentachord
// console.log(edo.get.harp_position_of_quality([0,1,3,4],scordatura,[-2,0,2])) // 1/4,1/2,1/4
// console.log(edo.get.harp_position_of_quality([21,0,1,4,5],scordatura,[-2,0,2])) // 3/4,1/4,3/4,1/4

// console.log(edo.get.harp_position_of_quality([0,4,8,12,16,19],scordatura,[-2,0,2])) //whole-tone pentachord + 3/4

// console.log(edo.get.harp_position_of_quality([0,1,2],scordatura,[-2,0,2])) //quarter-tone trichord


// console.log(edo.get.harp_position_of_quality([1,4,8,12,16,20],scordatura,[-2,0,2])) // 3/4 + whole-tone pentachord


// console.log(edo.get.harp_position_of_quality([20,0,4,8,11,14],scordatura,[-2,0,2])) //wholetone + overtone lydian
// console.log(edo.get.harp_position_of_quality([17,20,0,4,8,11,14],scordatura,[-2,0,2])) //wholetone + overtone lydian variation

// console.log(edo.get.harp_position_of_quality([ 16, 3, 14, 2, 13, 0 ] ,scordatura,[-2,0,2])) //quartal triton and triton-1/4
// console.log(edo.get.harp_position_of_quality([4,11,18,1,8,16,0],scordatura,[-2,0,2])) //out of tune major 3 stack
// console.log(edo.get.harp_position_of_quality([2,10,17,1,8,16,0],scordatura,[-2,0,2])) //out of tune major 3 stack
// console.log(edo.get.harp_position_of_quality([17,1,9,16,0,7,15],scordatura,[-2,0,2])) //out of tune major 3 stack
// console.log(edo.get.harp_position_of_quality([18,2,10,17,0,7,14],scordatura,[-2,0,2])) //out of tune major 3 stack
// console.log(edo.get.harp_position_of_quality([4,12,19,2,9,16,0],scordatura,[-2,0,2])) //out of tune major 3 stack
// console.log(edo.get.harp_position_of_quality([10,18,1,8,16,0,7],scordatura,[-2,0,2])) //out of tune major 3 stack
// console.log(edo.get.harp_position_of_quality([18,1,8,16,0,7,14],scordatura,[-2,0,2])) //out of tune major 3 stack
// console.log(edo.get.harp_position_of_quality([3,10,18,2,9,16,0],scordatura,[-2,0,2])) //out of tune major 3 stack

/**Stacked thirds of size 8 or 5*/

// console.log(edo.get.harp_position_of_quality([8,16,0,5,13,18,2],scordatura,[-2,0,2]))
// console.log(edo.get.harp_position_of_quality([4,9,14,19,0,8,16],scordatura,[-2,0,2]))
// console.log(edo.get.harp_position_of_quality([16,0,5,13,18,2,10],scordatura,[-2,0,2]))
// console.log(edo.get.harp_position_of_quality([1,9,14,19,0,5,13],scordatura,[-2,0,2]))
// console.log(edo.get.harp_position_of_quality([0,8,13,18,2,7,12],scordatura,[-2,0,2]))
// console.log(edo.get.harp_position_of_quality([16,0,8,13,18,2,7],scordatura,[-2,0,2]))
// console.log(edo.get.harp_position_of_quality([3,11,19,0,5,10,15],scordatura,[-2,0,2]))
// console.log(edo.get.harp_position_of_quality([6,11,16,0,5,10,18],scordatura,[-2,0,2]))

/**Stacked thirds of size 6 or 5*/

// console.log(edo.get.harp_position_of_quality([0,6,12,18,23,4,9],scordatura,[-2,0,2]))
// console.log(edo.get.harp_position_of_quality([22,4,9,14,20,1,6],scordatura,[-2,0,2]))
// console.log(edo.get.harp_position_of_quality([20,1,6,11,16,22,4],scordatura,[-2,0,2]))
// console.log(edo.get.harp_position_of_quality([8,14,20,1,6,11,16],scordatura,[-2,0,2]))
// console.log(edo.get.harp_position_of_quality([22,3,8,14,20,2,7],scordatura,[-2,0,2])) ?
// console.log(edo.get.harp_position_of_quality([22,3,9,14,20,2,8],scordatura,[-2,0,2]))
// console.log(edo.get.harp_position_of_quality([4,10,16,22,3,9,14],scordatura,[-2,0,2]))
// console.log(edo.get.harp_position_of_quality([6,11,16,22,3,8,14],scordatura,[-2,0,2]))

/** Modes of limited transposition*/
// console.log(edo.get.harp_position_of_quality([0,1,4,12,13,16],scordatura,[-2,0,2])) //MOLT **
// console.log(edo.get.harp_position_of_quality([0,1,5,12,13,17],scordatura,[-2,0,2])) //MOLT
// console.log(edo.get.harp_position_of_quality([0,1,6,12,13,18],scordatura,[-2,0,2])) //MOLT
// console.log(edo.get.harp_position_of_quality([0,1,8,9,16,17],scordatura,[-2,0,2])) //MOLT **
// console.log(edo.get.harp_position_of_quality([0,1,12,13],scordatura,[-2,0,2])) //MOLT
// console.log(edo.get.harp_position_of_quality([0,2,5,12,14,17],scordatura,[-2,0,2])) //MOLT *
// console.log(edo.get.harp_position_of_quality([0,2,7,12,14,19],scordatura,[-2,0,2])) //MOLT *
// console.log(edo.get.harp_position_of_quality([0,2,12,14],scordatura,[-2,0,2])) //MOLT
// console.log(edo.get.harp_position_of_quality([0,3,4,12,15,16],scordatura,[-2,0,2])) //MOLT
console.log(edo.get.harp_position_of_quality([0,3,6,12,15,18],scordatura,[-2,0,2])) //MOLT **
// console.log(edo.get.harp_position_of_quality([0,3,7,12,15,19],scordatura,[-2,0,2])) //MOLT *
// console.log(edo.get.harp_position_of_quality([0,3,12,15],scordatura,[-2,0,2])) //MOLT
// console.log(edo.get.harp_position_of_quality([0,4,5,12,16,17],scordatura,[-2,0,2])) //MOLT **
// console.log(edo.get.harp_position_of_quality([0,4,7,12,16,19],scordatura,[-2,0,2])) //MOLT **
// console.log(edo.get.harp_position_of_quality([0,4,12,16],scordatura,[-2,0,2])) //MOLT
// console.log(edo.get.harp_position_of_quality([0,5,6,12,17,18],scordatura,[-2,0,2])) //MOLT
// console.log(edo.get.harp_position_of_quality([0,5,12,17],scordatura,[-2,0,2])) //MOLT

// console.log(edo.get.harp_position_of_quality([ 0, 1, 8, 9, 16, 17 ],scordatura,[-2,0,2])) //MOLT
// console.log(edo.get.harp_position_of_quality([ 0, 2, 8, 10, 16, 18 ],scordatura,[-2,0,2])) //MOLT
// console.log(edo.get.harp_position_of_quality([ 0, 3, 8, 11, 16, 19 ],scordatura,[-2,0,2])) //MOLT
// console.log(edo.get.harp_position_of_quality([ 0, 4, 8, 12, 16, 20 ],scordatura,[-2,0,2])) //MOLT
// console.log(edo.get.harp_position_of_quality([ 0, 5, 8, 13, 16, 21 ],scordatura,[-2,0,2])) //MOLT
// console.log(edo.get.harp_position_of_quality([ 0, 6, 8, 14, 16, 22 ],scordatura,[-2,0,2])) //MOLT
// console.log(edo.get.harp_position_of_quality([ 0, 7, 8, 15, 16, 23 ],scordatura,[-2,0,2])) //MOLT



/** All possible 7 note scales with 2 step sizes*/
// console.log(edo.get.harp_position_of_quality([0,3,6,10,13,16,20],scordatura,[-2,0,2]))
// console.log(edo.get.harp_position_of_quality([0,3,6,9,12,16,20],scordatura,[-2,0,2]))

/** All possible 7 note scales with only ICs 1,2 or 3*/
// console.log(edo.get.harp_position_of_quality([0,2,5,8,10,13,16],scordatura,[-2,0,2]))
// console.log(edo.get.harp_position_of_quality([0,2,5,8,11,14,16],scordatura,[-2,0,2]))
// console.log(edo.get.harp_position_of_quality([0,3,6,8,11,14,16],scordatura,[-2,0,2]))

/** Mono-Stacks*/
// console.log(edo.get.harp_position_of_quality([0,9,18,3,12],scordatura,[-2,0,2])) //IC9
// console.log(edo.get.harp_position_of_quality([6,13,20,3,10],scordatura,[-2,0,2])) //IC7
// console.log(edo.get.harp_position_of_quality([4,9,14,19,0],scordatura,[-2,0,2])) //IC5
// console.log(edo.get.harp_position_of_quality([0,3,6,9,12],scordatura,[-2,0,2])) //IC3



// [1,2,8,7,16,16,0]

/** Possible unisons: 6, 16, 20*/
// let size = 5
// let stacks = edo.get.interval_stack([11,12],size)
// scales = stacks.map(stack=>edo.get.unique_elements(edo.convert.intervals_to_scale(stack).map(note=>note%edo.edo))).filter(el=>el.length==size)
// scales = scales.filter(scale=>{
//     return edo.get.harp_position_of_quality(scale,scordatura,[-2,0,2]).length>0
// })
// scales =scales.map(scale=>edo.get.harp_position_of_quality(scale,scordatura,[-2,0,2])[0])










// let configurations = ["NNSFNSS", "NNFFNNF", "NNFFNSN", "NNNFNSS", "SSNNSNN", "NNFSSSN", "NNNFFFN", "SSNNNNN", "NNFFFFN", "NNNFFFS", "NNNNFNN", "NNFFFNS", "NNSSSSN", "NNSFNNN", "NNNFNNN", "NNNNNNN", "NNNSSNF", "NNNSSSN", "SSNNNNF", "SSNNNSN", "NFFNNSN", "FSSSNFN", "NNFNNFF", "NNFNFFF", "NSNFFNN", "FNSNNFF", "NSNFNNN", "NNSFNSS", "NNFFNNF", "NNFFNSN", "NNNFNSS", "NSNFFFN", "SSNNNNN", "NNFFNFF", "SSNNNNN", "NSNFFFN", "NNFFFFF", "SSNNNNN", "SSNNSFN", "FSNFSNN", "FNSFSFN", "FNNFSFN", "FNSNSFS", "FNFNSFN", "FNNNSFS", "FSFNSNN", "FSNNSNS", "FNNFSNN", "FNFNSNN", "FNNNSNS", "NNFNFFF", "SSNNNNN"]
//
// let matrix = Array.from([...Array(configurations.length+1)])
// matrix = matrix.map(m=>Array.from([...Array(configurations.length+1)]))
//
//
//
// for (let i = 1; i <= configurations.length; i++) {
//     matrix[i][0] = configurations[i-1]
//     matrix[0][i] = configurations[i-1]
// }
//
//
// for (let i = 0; i < configurations.length; i++) {
//     let line = i+1
//     let item1_line = 0
//     let item2_line=line
//
//     for (let j = 0; j < configurations.length; j++) {
//         let col = j+1
//         let item1_col = col
//         let item2_col = 0
//         let item1 = matrix[item1_line][item1_col]
//         let item2 = matrix[item2_line][item2_col]
//         let distance = 0
//         for (let k = 0; k < item1.length; k++) {
//             if(item1[k]!=item2[k]) distance++
//         }
//
//         matrix[line][col] = distance
//     }
//
// }
//
// matrix = matrix.map(row=>row.join(',')).join('\n')
// console.log(matrix)
// edo = new EDO(12)



// let syl = ['Ne','Ver','Sed','Shi','Stoul','Yor','Ma','Ni']
// for (let i = 0; i < 10; i++) {
//     console.log(JSON.stringify(edo.shuffle_array(syl)))
// }


// let scales = edo.get.scales(1,12,2,6,7)
// scales.filter(scale=>scale.is.MOLT()).forEach(scale=>{
//     console.log(JSON.stringify(scale.pitches))
// })



// let stacks = edo.get.interval_stack([6,7,8],7)
// let scales = []
//
// let pedals = []
// stacks.forEach(stack=> {
//     let scale = edo.convert.intervals_to_scale(stack).map(note=>note%edo.edo)
//     scale = edo.get.unique_elements(scale)
//     if(scale.length==7) {
//         let harp = edo.get.harp_position_of_quality(scale,scordatura,[-2,0,2])
//         if(harp.length>0) {
//             scales.push(harp[0])
//             pedals.push(harp[0]['pedals'])
//         }
//     }
// })
// let perms = edo.get.permutations(scales)
// let min=1000
// let collection
// perms.forEach(perm=>{
//     let pedals = []
//     perm.forEach(el=>{
//         let ordered = []
//         for (let i = 1; i <= 7; i++) {
//             ordered.push(el['pedals'][el['strings'].indexOf(i)])
//         }
//         pedals.push(ordered)
//     })
//
//
//
//
//     let val = edo.count.differences(...pedals).reduce((ag,el)=>ag+el,0)
//     if(val<min) {
//         min=val
//         collection=Array.from(perm)
//     }
// })
// console.log(collection,min,collection.length)
//
// let confs = scordatura.map(note=>[note-2,note,note+2])
// let parts = edo.get.partitioned_subsets(confs).map(scale=>edo.scale(scale).normal())
// parts = parts.filter(scale=>scale.get.step_sizes().length==3)
// parts = parts.map(p=>p.pitches)
// let unique = edo.get.unique_elements(parts).filter(el=>el.length==7)
// console.log(unique.forEach(el=>console.log(JSON.stringify(el))))





/**Finds qualities constrained to certain intervals*/

//
// let confs = scordatura.map(note=>[note-2,note,note+2])
// let length = 5
// confs = edo.get.unique_elements(edo.get.partitioned_subsets(confs).map(el=>edo.get.normal_order(el))).filter(el=>el.length>=length)
// confs = confs.map(scale=>{
//     let s = edo.scale(scale).get.quality_with_intervals([11],length)
//     return s
// }).filter(e=>e.length>0)
// confs = edo.get.unique_elements(confs)
// confs.forEach(conf=>console.log(JSON.stringify(conf)))
//
//
//
//
// let qualities=[]
// qualities.push(...edo.get.harp_position_of_quality([6,12,18,0,5,10,15],scordatura,[-2,0,2]))
// qualities.push(...edo.get.harp_position_of_quality([2,8,13,18,0,5,10],scordatura,[-2,0,2]))
// qualities.push(...edo.get.harp_position_of_quality([4,9,14,19,0,6,12],scordatura,[-2,0,2]))
// qualities.push(...edo.get.harp_position_of_quality([2,8,14,19,0,5,10],scordatura,[-2,0,2]))
// qualities.push(...edo.get.harp_position_of_quality([2,7,12,18,0,6,11],scordatura,[-2,0,2]))
// qualities.push(...edo.get.harp_position_of_quality([2,7,13,18,0,6,12],scordatura,[-2,0,2]))
// qualities.push(...edo.get.harp_position_of_quality([6,12,18,0,5,11,16],scordatura,[-2,0,2]))
// qualities.push(...edo.get.harp_position_of_quality([8,13,18,0,5,10,16],scordatura,[-2,0,2]))
//
//
//
//
// qualities.forEach(q=>{
//     console.log(JSON.stringify(q))
// })
//
//
// let perms = edo.get.permutations(qualities)
// let min=1000
// let collection
// perms.forEach(perm=>{
//     let pedals = []
//     perm.forEach(el=>{
//         let ordered = []
//         for (let i = 1; i <= 7; i++) {
//             ordered.push(el['pedals'][el['strings'].indexOf(i)])
//         }
//         pedals.push(ordered)
//     })
//     let val = edo.count.differences(...pedals).reduce((ag,el)=>ag+el,0)
//     if(val<min) {
//         min=val
//         collection=Array.from(perm)
//     }
// })
// console.log(collection,min,collection.length)


// console.log(edo.get.harp_position_of_quality([0,4,8,11,14,19],scordatura,[-2,0,2]))

// molt = edo.get.scales(1,12,1,12,8)
//     .filter(m=>m.count.pitches()==8)
//     .filter(m=>m.count.transpositions()<8)
// molt.forEach(m=>console.log(m.pitches,m.to.steps()))