const fs = require('fs');
const csv = require('csv-parser');
const EDO = require("../edo").EDO


const make_csv = function (scales) {
    let id=0
    const createCsvWriter = require('csv-writer').createObjectCsvWriter;
    const csvWriter = createCsvWriter({
        path: "5-note-sets.csv",
        header: [
            {id: 'name', title: 'Name'},
            {id: 'id', title: 'ID'},
            {id: 'set', title: 'Pitches'},
            {id: 'triads', title: 'Major and Minor triads'},
            {id: 'propriety', title: 'Rothenberg Propriety'},
            {id: 'lerdahl_no_stable_neighbor', title: 'No Stable Neighbor'},
            {id: 'invertible', title: 'Invertible'},
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
            {id: 'set_mean', title: 'Set Mean (Spread)'},
            {id: 'num_of_triads', title: '# Triads'},
            {id: 'num_of_trichords', title: '# Trichords'},
            {id: 'name', title: 'Name'},
        ]
    });

    let data =scales.map((scale,i) => {
        let interval_vector = scale.get.interval_vector()
        let lerdahl_vector = scale.get.lerdahl_attraction_vector()
        let dat = {
            name: scale.get.name().split('-')[1],
            id: id++,
            set: scale.get.pitches(),
            triads: scale.count.major_minor_triads(),
            propriety: scale.get.rothenberg_propriety(),
            lerdahl_no_stable_neighbor: scale.parent.get.subset_indices(['*','*','*'],lerdahl_vector,false).length>0,
            invertible: scale.is.invertible(),
            unique_step_sizes: scale.get.step_sizes().length,
            IC1: interval_vector[0],
            IC2: interval_vector[1],
            IC3: interval_vector[2],
            IC4: interval_vector[3],
            IC5: interval_vector[4],
            IC6: interval_vector[5],
            num_of_trichords: scale.count.trichords(),
            num_of_triads: scale.get.stacks(3,1).length,
            set_mean: scale.get.pitches().reduce((a,b)=>a+b,0)/scale.count.pitches(),
            consecutive_semitones: scale.count.consecutive_steps(1),
            subset_of_diatonic: scale.is.subset([0,2,4,5,7,9,11]),
            subset_of_MOLT: scale.get.supersets(MOLT).length,
            num_of_transpositions: scale.count.transpositions()

        }

        return dat
    })
    csvWriter
        .writeRecords(data)
        .then(()=> console.log("CSV file created."));

    fs.writeFileSync('5-note-sets.json', JSON.stringify(data));

}


let divisions = 12
edo = new EDO(divisions)
let scales = edo.get.scales(1,12,1,12)
const MOLT = [...scales]
    .filter((scale)=>scale.count.transpositions()<12 && scale.count.pitches()<12)
    .map((scale)=>scale.pitches)
scales = scales.filter((scale)=>scale.count.pitches()==5)
for(let scale of scales) {
    console.log(scale.pitches,scale.count.rotational_symmetries())
}

make_csv(scales)

