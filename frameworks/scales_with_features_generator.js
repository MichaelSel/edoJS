/**
 * DO NOT RUN THIS FILE THE FILE HAS ALREADY DID ITS JOB
 * AND GENERATED THE FILE 7-note-sets.json/csv
 * */


const fs = require('fs');
const csv = require('csv-parser');
const EDO = require("edo.js").EDO


const make_csv = function (scales,filename) {
    let id=0
    const createCsvWriter = require('csv-writer').createObjectCsvWriter;
    const csvWriter = createCsvWriter({
        path: filename,
        header: [
            {id: 'name', title: 'Cardinal Name'},
            {id: 'id', title: 'ID'},
            {id: 'set', title: 'Pitches'},
            {id: 'triads', title: 'Major and Minor triads'},
            {id: 'propriety', title: 'Rothenberg Propriety'},
            {id: 'lerdahl_instable_modes', title: 'Lerdahl Instable Modes'},
            {id: 'unique_step_sizes', title: 'Unique Step Sizes'},
            {id: 'IC1', title: '# IC 1'},
            {id: 'IC2', title: '# IC 2'},
            {id: 'IC3', title: '# IC 3'},
            {id: 'IC4', title: '# IC 4'},
            {id: 'IC5', title: '# IC 5'},
            {id: 'IC6', title: '# IC 6'},
            {id: 'consecutive_semitones', title: 'Consecutive semitones'},
            {id: 'subset_of_diatonic', title: 'Subset of Diatonic'},
            {id: 'subset_of_MOLT', title: 'Subset of MOLT'},
            {id: 'num_of_transpositions', title: '# Transpositions'},
            {id: 'set_unevenness', title: 'Spread Unevenness'},
            {id: 'num_of_triads', title: '# Triads'},
            {id: 'num_of_trichords', title: 'Unique Trichords'},
            {id: 'total_trichords', title: 'Total Trichords'},
            {id: 'dissonance_min', title: 'Dissonance Min'},
            {id: 'dissonance_max', title: 'Dissonance Max'},
            {id: 'dissonance_med', title: 'Dissonance Median'},
            {id: 'violations', title: 'Semitone Set Violations'},
            {id: 'segments', title: '# Segments'},
            {id: 'role_clarity', title: 'Scale Degree Clarity'},
            {id: 'motive_strength', title: 'Motive Strength'},
            {id: 'lev_penta', title: 'Levenshtein Distance Pentatonic'},
            {id: 'lev_dia', title: 'Levenshtein Distance Diatonic'},
            {id: 'stackable_in_3rds', title: 'Stackable with 3rds'},
            {id: 'fully_scalar', title: 'Scalar Pentachord'},
            {id: 'imperfections', title: 'Imperfections'},
            {id: 'area', title: 'Polygon Area'},
            {id: 'inverse_cardinal', title: 'Inverse Card. name'},
            {id: 'diatonic_parents', title: 'Diatonic Parents'},
            {id: 'harmonicm_parents', title: 'Harmonic Minor Parents'},
            {id: 'melodicm_parents', title: 'Melodic Minor Parents'},
            {id: 'unique_diads', title: 'Unique Diads'},
            {id: 'total_diads', title: 'Total Diads'},
            {id: 'sameness_quotient', title: 'Sameness Quotient'},
            {id: 'coherence_quotient', title: 'Coherence Quotient'},
            {id: 'prime_form', title: 'Prime Form?'},
            {id: 'note2', title: 'Note 2'},
            {id: 'note3', title: 'Note 3'},
            {id: 'note4', title: 'Note 4'},
            {id: 'note5', title: 'Note 5'},






        ]
    });

    let data =scales.map((scale,i) => {
        let interval_vector = scale.get.interval_vector()

        let instable_modes = 0
        for (let j = 0; j < scale.count.pitches(); j++) {
            let lerdahl_vector = scale.mode(j).get.lerdahl_attraction_vector()
            if(scale.parent.get.subset_indices(['*','*','*'],lerdahl_vector,false).length>0) instable_modes++
        }





        let violations = scale.pitches.reduce((agg,el,ind,set)=>{
            if(set.indexOf(edo.mod(el+1,12))==-1) agg++
            if(set.indexOf(edo.mod(el-1,12))==-1) agg++
            return agg
        },0)

        let tonal_interpretations = 0
        // for (let i = 0; i < scale.count.pitches(); i++) {
        //     let possibilities = scale.mode(i).get.scale_degree_roles()
        //         .filter(r=>edo.get.unique_elements(r).length==scale.count.pitches())
        //         .filter(r=>{
        //             let v1 = [...r].sort((a,b)=>a-b)
        //             return edo.is.same(v1,r)
        //         })
        //
        //
        //     if(possibilities.length>0) tonal_interpretations++
        // }

        let r = edo.get.motives([...scale.pitches,12])
        let motive_strength = r[0].motive.length*r[0].incidence + 1

        let binary = []
        for (let i = 11; i >=0; i--) {
            binary.push(+(scale.pitches.indexOf(i)!=-1))
        }
        binary = parseInt(binary.join(""))

        let lev_penta = Infinity

        for (var i = 0; i < scale.count.pitches(); i++) {
            let p = scale.mode(i).get.pitches()
            let score = edo.get.levenshtein(p,[0,2,4,7,9])
            if(score<lev_penta) lev_penta=score
        }

        let lev_dia = Infinity

        for (var i = 0; i < scale.count.pitches(); i++) {
            let p = scale.mode(i).get.pitches()
            let score = edo.get.levenshtein(p,[0,2,4,5,7,9,11])
            if(score<lev_dia) lev_dia=score
        }

        let steps = scale.to.steps()
        let mean_step = steps.reduce((a,e)=>a+e,0)/scale.count.pitches()
        let unevenness = 0
        steps.forEach(step=>unevenness+=Math.abs(step-mean_step))

        let stackable_in_3rds = edo.get.stacked(scale.pitches,[3,4]).length>0

        let scalar = edo.get.stacked(scale.pitches,[1,2]).length>0


        let diatonic = edo.scale([0,2,4,5,7,9,11]) //
        let harmonicm = edo.scale([0,2,3,5,7,8,11]) //
        let melodicm = edo.scale([0,2,3,5,7,9,11]) //
        let all_diatonic = []
        let all_harmonicm = []
        let all_melodicm = []
        for (let i = 0; i < 12; i++) {
            all_diatonic.push(diatonic.get.transposition(i).sort((a,b)=>a-b))
            all_harmonicm.push(harmonicm.get.transposition(i).sort((a,b)=>a-b))
            all_melodicm.push(melodicm.get.transposition(i).sort((a,b)=>a-b))
        }



        let total_diatonic = all_diatonic.map(t=>edo.is.subset(scale.pitches,t)).filter(t=>t).length
        let total_harmonicm = all_harmonicm.map(t=>edo.is.subset(scale.pitches,t)).filter(t=>t).length
        let total_melodicm = all_melodicm.map(t=>edo.is.subset(scale.pitches,t)).filter(t=>t).length

        let roughness = scale.get.roughness(true)
        let min_r = Math.min(...roughness)
        let max_r = Math.max(...roughness)
        let med_r = roughness[2]


        let dat = {
            name: scale.get.name().split('-')[1],
            id: id++,
            set: scale.get.pitches(),
            triads: scale.count.major_minor_triads(),
            propriety: scale.get.rothenberg_propriety(),
            lerdahl_instable_modes: instable_modes,
            unique_step_sizes: scale.get.step_sizes().length,
            IC1: interval_vector[0],
            IC2: interval_vector[1],
            IC3: interval_vector[2],
            IC4: interval_vector[3],
            IC5: interval_vector[4],
            IC6: interval_vector[5],
            num_of_trichords: scale.count.trichords(),
            total_trichords: scale.get.n_chords_diatonic(3).map(a=>a.combos.map(c=>c.positions.length)).map(a=>a.reduce((ag,e)=>ag+e,0)).reduce((a,e)=>a+e,0),
            num_of_triads: scale.get.stacks(3,1).length,
            set_unevenness: unevenness/11.2,
            consecutive_semitones: scale.count.consecutive_steps(1),
            subset_of_diatonic: scale.is.subset([0,2,4,5,7,9,11]),
            subset_of_MOLT: scale.get.supersets(MOLT).length,
            num_of_transpositions: scale.count.transpositions(),
            dissonance_min:min_r,
            dissonance_max:max_r,
            dissonance_med:med_r,
            violations: violations,
            segments: scale.get.segments().length,
            role_clarity: tonal_interpretations/scale.count.pitches(),
            motive_strength: motive_strength,
            lev_penta:lev_penta,
            lev_dia:lev_dia,
            stackable_in_3rds:stackable_in_3rds,
            fully_scalar:scalar,
            imperfections: scale.count.imperfections(),
            area: scale.get.area(),
            inverse_cardinal:edo.scale(scale.get.inversion()).get.name().split('-')[1],
            prime_form: + scale.is.prime_form(),
            diatonic_parents: total_diatonic,
            harmonicm_parents:total_harmonicm,
            melodicm_parents: total_melodicm,
            unique_diads: scale.get.n_chords(2).length,
            total_diads: scale.get.n_chords_diatonic(2).map(a=>a.combos.map(c=>c.positions.length)).map(a=>a.reduce((ag,e)=>ag+e,0)).reduce((a,e)=>a+e,0),
            sameness_quotient: scale.get.sameness_quotient(),
            coherence_quotient: scale.get.coherence_quotient(),
            note2:scale.pitches[1],
            note3:scale.pitches[2],
            note4:scale.pitches[3],
            note5:scale.pitches[4],




        }

        return dat
    })
    csvWriter
        .writeRecords(data)
        .then(()=> console.log("CSV file created."));

    fs.writeFileSync('7-note-sets.json', JSON.stringify(data));

}


let divisions = 24
let num_of_notes = 7
edo = new EDO(divisions)
let scales = edo.get.scales(1,6,1,4,num_of_notes)
const MOLT = [...scales]
    .filter((scale)=>scale.count.transpositions()<edo.edo && scale.count.pitches()<edo.edo)
    .map((scale)=>scale.pitches)
scales = scales.filter((scale)=>scale.count.pitches()==num_of_notes)

make_csv(scales,"7 notes in 24 edo.csv")

