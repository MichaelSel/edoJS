function unit_tests() {
    const EDO = require("../index.js").EDO;
    const assert = require('assert');
    const should = require('chai').should()
    const edo12 = new EDO(12)
    const edo17 = new EDO(17)
    const edo31 = new EDO(31)
    const edo1200 = new EDO(1200)

    const dia = edo12.scale([0,2,4,5,7,9,11]) //Diatonic scale in 12EDO
    const WT = edo12.scale([0,2,4,6,8,10]) //Whole-tone scale
    const penta =edo12.scale([0,2,4,7,9]) // The Pentatonic Scale
    const octa = edo12.scale([0,2,3,5,6,8,9,11]) // The Octatonic scale
    const maj3 = edo12.scale([0,4,7]) // The major triad
    const min3 = edo12.scale([0,3,7]) // The minor triad
    const f6f7 = edo12.scale([0,2,4,5,7,8,10]) // Major scale with flat 6 and flat 7
    const dimdim = edo12.scale([0,3,6,9]) // fully diminished

    describe("EDO Class Unit Tests", function () {
        describe('EDO.convert', function () {
            describe('Deterministic tests in 12EDO', function () {
                let tests = {
                    cents_to_ratio: [edo12.convert.cents_to_ratio, [700], 1.4983070768766815],
                    cents_to_simple_ratio: [edo12.convert.cents_to_simple_ratio, [700], {
                        "cents": 1901.9550008653873,
                        "cents_in_octave": 701.9550008653873,
                        "value": 3,
                        "diff_in_octave": -1.9550008653873192,
                        "ratio": "3:1",
                        "original": 700
                    }],
                    freq_to_midi: [edo12.convert.freq_to_midi, [445], { midi: 69, cents: 20 }],
                    interval_to_cents: [edo12.convert.interval_to_cents, [6], 600],
                    interval_to_ratio: [edo12.convert.interval_to_ratio, [7], 1.4983070768766815],
                    intervals_to_pitches: [edo12.convert.intervals_to_pitches, [[2, 3]], [0, 2, 5]],
                    intervals_to_scale: [edo12.convert.intervals_to_scale, [[2, 2, 1, 2, 2, 2, 1]], [0, 2, 4, 5, 7, 9, 11]],
                    midi_to_intervals: [edo12.convert.midi_to_intervals, [[60, 64, 57, 61]], [4, -7, 4]],
                    midi_to_name: [edo12.convert.midi_to_name, [[60, 62]], ["C4", "D4"]],
                    midi_to_freq: [edo12.convert.midi_to_freq, [[69, 70]], [440, 466.1637615180899]],
                    // name_to_scale: [edo.convert.name_to_scale,['12-1387']]
                    pc_to_name: [edo12.convert.pc_to_name, [4], "E"],
                    pitches_to_PCs: [edo12.convert.pitches_to_PCs, [[0, 2, 12, -2, 7]], [0, 2, 0, 10, 7]],
                    ratio_to_cents: [edo12.convert.ratio_to_cents, [5 / 4], 386.3137138648348],
                    ratio_to_interval: [edo12.convert.ratio_to_interval, [5 / 4, 20], [4]],
                    to_steps: [edo12.convert.to_steps, [[0, 2, 4, 5, 7, 9, 11]], [2, 2, 1, 2, 2, 2]]

                }

                for(let test_name in tests) {
                    it(test_name,function(){
                        tests[test_name][0](...tests[test_name][1]).should.be.eql(tests[test_name][2])
                    })
                }
            })
        });
        describe('EDO.count', function () {
            describe('Deterministic tests in 12EDO', function () {
                let tests = {
                    common_tones: [edo12.count.common_tones, [[1,2,4],[2,3,4,5]], 2],
                    differences: [edo12.count.differences,[[0,2,3],[0,1,2],[0,2,4],[0,2,1,1,1]],[2,2,3]],
                    pitches: [edo12.count.pitches, [[0, 3, 3, 2, 4, 3, 4]],[[3,3],[4,2],[0,1],[2,1]]]
                }
                for(let test_name in tests) {
                    it(test_name,function(){
                        tests[test_name][0](...tests[test_name][1]).should.be.eql(tests[test_name][2])
                    })
                }
            })
        })
        describe('EDO.get', function () {
            describe('Deterministic tests in 12EDO', function () {
                let tests = {
                    angle: [edo12.get.angle, [[0, 3, 6]], 90],
                    // best_edo_from_cents: edo12.get.best_edo_from_cents([0,200,350,500,700,900,1100])
                    coordinates: [edo12.get.coordinates, [[0, 3, 7]], [[0, 0.56418958354776], [0.56418958354776, 3.454664838020213e-17], [-0.2820947917738801, -0.48860251190292314]]],
                    contour: [edo12.get.contour, [[0, 4, 7, 12, 16, 7, 12, 16], true], [1, 1, 1, 1, -1, 1, 1]],
                    // contour_motives: edo12.get.contour_motives([7,6,7,6,7,2,5,3,0]).slice(0,4) //get first 3 motives
                    combinations: [edo12.get.combinations, [[1, 3, 5, 7], 2], [[1, 3], [3, 1], [1, 5], [5, 1], [1, 7], [7, 1], [3, 5], [5, 3], [3, 7], [7, 3], [5, 7], [7, 5]]],
                    complementary_interval: [edo12.get.complementary_interval, [3], 9],
                    complementary_set: [edo12.get.complementary_set, [[0, 2, 4, 5, 7, 9, 11], true], [0, 2, 5, 7, 9]],
                    // harmonic_progression: [edo12.get.harmonic_progression, [[[0,3,7],[0,4,7]],[1,4,7]],[ [ 1, 4, 7 ], [ 11, 4, 7 ], [ 11, 2, 7 ], [ 10, 2, 7 ] ]],
                    // harmonized_melody: [edo12.get.harmonized_melody, [[7,4,5,2,4,0,2],[[0,4,7],[0,3,7]]],[[ 4, 7, 11 ], [ 4, 9, 0 ], [ 5, 9, 2 ], [ 7, 11, 2 ], [ 7, 0, 4 ], [ 9, 0, 4 ], [ 9, 2, 5 ]]],
                    // harp_position_of_quality: [edo12.get.harp_position_of_quality, [[0,1,2,3]], [{"strings":[6,1,7,2],"pedals":[1,-1,1,-1],"pitches":[10,11,0,1]},{"strings":[5,6,7,1],"pedals":[1,0,-1,-1],"pitches":[8,9,10,11]},{"strings":[3,4,5, 6],"pedals":[1,1,0,-1],"pitches":[5,6,7,8]},{"strings":[2,3,4,5],"pedals":[1,0,0,-1],"pitches":[3,4,5,6]},{"strings":[2,4,3,5],"pedals":[1,-1,1,-1],"pitches":[3,4,5,6]},{"strings":[6,7,1,2],"pedals":[1,0,0,-1],"pitches":[10,11,0,1]},{"strings":[1,2,3,4],"pedals":[1,0,-1,-1],"pitches":[1,2,3,4]},{"strings":[7,1,2,3],"pedals":[1,1,0,-1],"pitches":[0,1,2,3]}]],
                    harp_pedals_to_pitches: [edo12.get.harp_pedals_to_pitches, [[0, 0, 0, 0, 0, 1, -1]], [0, 2, 4, 5, 7, 10, 10]],
                    // harp_least_pedals_passage
                    // fill_partial_harp_pedaling
                    interval_class: [edo12.get.interval_class, [1, 8], 5],
                    n_choose_k: [edo12.get.n_choose_k, [[1, 3, 5, 7], k = 3], [[1, 3, 5], [1, 3, 7], [1, 5, 7], [3, 5, 7]]],
                    notes_from_cents: [edo12.get.notes_from_cents, [[0, 157, 325, 498, 655, 834, 1027]], [{
                        note: 0,
                        diff: 0
                    }, {note: 2, diff: 43}, {note: 3, diff: -25}, {note: 5, diff: 2}, {note: 7, diff: 45}, {
                        note: 8,
                        diff: -34
                    }, {note: 10, diff: -27}]],
                    sine_pair_dissonance: [edo12.get.sine_pair_dissonance, [440, 475], 0.08595492117939352],
                    resize_melody: [edo12.get.resize_melody, [[0, 2, 4, 5, 7, 5, 4, 2, -1, 0], 2], [0, 4, 8, 10, 14, 10, 8, 4, -2, 0]],
                    generated_scale: [edo12.get.generated_scale, [7, 5], [0, 2, 4, 7, 9]],
                    generators: [edo12.get.generators, [], [1, 5]],
                    intersection: [edo12.get.intersection, [[1, 2, 3, 4], [3, 4, 5, 6]], [3, 4]],
                    interval_traversed: [edo12.get.interval_traversed, [[2, -3, 4, -1]], 2],
                    interval_stack: [edo12.get.interval_stack, [[3, 2], 3, true], [[0, 2, 4, 6], [0, 3, 5, 7], [0, 2, 5, 7], [0, 2, 4, 7], [0, 3, 6, 8], [0, 3, 5, 8], [0, 2, 5, 8], [0, 3, 6, 9]]],
                    inversion: [edo12.get.inversion, [[0, 2, 4, 5, 7, 9, 11]], [0, 2, 4, 6, 7, 9, 11]],
                    // lattice
                    levenshtein: [edo12.get.levenshtein, [[0, 2, 4, 7, 9], [0, 2, 4, 5, 7, 9, 11]], 2],
                    maximal_rahn_difference: [edo12.get.maximal_rahn_difference, [7], 126],
                    maximal_carey_coherence_failures: [edo12.get.maximal_carey_coherence_failures, [7], 140],
                    minimal_voice_leading: [edo12.get.minimal_voice_leading, [[7, 0, 3], [4, 8, 11]], [8, 11, 4]],
                    modes: [edo12.get.modes, [[0, 2, 4, 5, 7, 9, 11]], [[0, 2, 4, 5, 7, 9, 11], [0, 2, 3, 5, 7, 9, 10], [0, 1, 3, 5, 7, 8, 10], [0, 2, 4, 6, 7, 9, 11], [0, 2, 4, 5, 7, 9, 10], [0, 2, 3, 5, 7, 8, 10], [0, 1, 3, 5, 6, 8, 10]]],
                    // edo12.get.motives([7,6,7,6,7,2,5,3,0])
                    necklace: [edo12.get.necklace, [[2, 2, 1, 2, 2, 2, 1]], [[2, 2, 2, 1, 2, 2, 1], [2, 2, 2, 2, 1, 2, 1], [2, 2, 2, 2, 2, 1, 1]]],
                    new_pitches: [edo12.get.new_pitches, [[2, 1, 0, 5, 4, 3, 0, 2, 8, 4, 1, 0, 9, 1]], [[2, 0], [1, 1], [0, 2], [5, 3], [4, 4], [3, 5], [8, 8], [9, 12],]],
                    ngrams: [edo12.get.ngrams,[[4,4,5,7,7,5,4,2,0,0,2,4,4,2,2]],{'0': [ 0, 2 ],'2': [ 0, 4, 2 ],'4': [ 4, 5, 2, 4, 2 ],'5': [ 7, 4 ],'7': [ 7, 5 ],'4 4': [ 5, 2 ],'4 5': [ 7 ],'5 7': [ 7 ],'7 7': [ 5 ],'7 5': [ 4 ],'5 4': [ 2 ],'4 2': [ 0, 2 ],'2 0': [ 0 ],'0 0': [ 2 ],'0 2': [ 4 ],'2 4': [ 4 ]}],
                    normal_order:[edo12.get.normal_order,[[0,2,4,5,7,9,11]],[ 0, 1, 3, 5, 6, 8, 10 ]],
                    stacked:[edo12.get.stacked,[[0,2,4,6,9],[3,4]],[ [ 2, 6, 9, 12, 16 ] ]],
                    without: [edo12.get.without,[[0,1,3,4,6,7,9,10],[0,4,9]],[1,3,6,7,10]],
                    partitioned_subsets:[edo12.get.partitioned_subsets,[[4,[7,8],[10,11]]],[ [ 4, 7, 10 ], [ 4, 7, 11 ], [ 4, 8, 10 ], [ 4, 8, 11 ] ]],
                    // path_n_steps: [edo12.get.path_n_steps(3,[[3],[-3]],3)]
                    // path_on_tree: [edo12.get.path_on_tree()]
                    permutations: [edo12.get.permutations,[[0, 2, 3]],[[ 0, 2, 3 ],[ 0, 3, 2 ],[ 2, 0, 3 ],[ 2, 3, 0 ],[ 3, 0, 2 ],[ 3, 2, 0 ]]],
                    pitch_distribution: [edo12.get.pitch_distribution,[[0,12,0,12,7,0]],[{"note": 0,"rate": 0.5},{"note": 12,"rate": 0.3333333333333333},{"note": 7,"rate": 0.16666666666666666}]],
                    pitch_fields: [edo12.get.pitch_fields,[[8,7,7,8,7,7,8,7,7,15,15,14,12,12,10,8,8,7,5,5],5,false,true,true], [[ 7, 8, 12, 14, 15 ],[ 7, 10, 12, 14, 15 ],[ 8, 10, 12, 14, 15 ],[ 7, 8, 10, 12, 14 ],[ 5, 7, 8, 10, 12 ],[ 5, 7, 8, 10 ]]],
                    // random_melody:[edo12.get.random_melody(4,[-3,2])]
                    // random_melody_from_contour: [edo12.get.random_melody_from_contour([0,3,1,3,2],[0,12],[0,2,4,5,7,9,11])]
                    // random_melody_from_ngram:[edo12.get.random_melody_from_ngram(ngrams)]
                    // random_melody_from_distribution: [edo12.get.random_melody_from_distribution(dist)]
                    ratio_approximation:[edo12.get.ratio_approximation,[7],{"cents_offset": -1.955000865387433,"decimal": 1.5,"log_position": 0.5849625007211562,"octave": 1,"ratio": "3:2"}],
                    retrograde: [edo12.get.retrograde,[[0,2,4,5,7,9,11]],[11,9,7,5,4,2,0]],
                    rotated: [edo12.get.rotated,[[0,2,4,5,7],2],[4,5,7,0,2]],
                    rotations: [edo12.get.rotations,[[0,4,7,4]],[ [ 0, 4, 7, 4 ], [ 4, 7, 4, 0 ], [ 7, 4, 0, 4 ], [ 4, 0, 4, 7 ] ]],
                    // scalar_melodies: [edo12.get.scalar_melodies(melody)],
                    //scales: [edo12.get.scales()]
                    shortest_path:[edo12.get.shortest_path,[7,[5,-3]],[ -3, 5, 5 ]],
                    //simple_ratios: [edo12.get.simple_ratios()]
                    starting_at:[edo12.get.starting_at,[[5,1,8],2,false],[2,-2,5]],
                    subset_indices: [edo12.get.subset_indices,[[0, 2, 3], [0, 0, 2, 0, 2, 3, 3]],[[ 0, 2, 5 ], [ 0, 2, 6 ],[ 0, 4, 5 ], [ 0, 4, 6 ],[ 1, 2, 5 ], [ 1, 2, 6 ],[ 1, 4, 5 ], [ 1, 4, 6 ],[ 3, 4, 5 ], [ 3, 4, 6 ]]],
                    subsets: [edo12.get.subsets,[[0,2,3],true],[[0],[2],[0,2],[3],[0,3],[2,3],[0,2,3]]],
                    transposition: [edo12.get.transposition,[[0,2,4,5,7,9,11],7],[7, 9, 11, 0, 2, 4,  6]],
                    union: [edo12.get.union,[[0,1,2],[3,4,5],[6]],[0,1,2,3,4,5,6]],
                    unique_elements: [edo12.get.unique_elements,[[1,[2,3],2,[2,3],2]],[ 1, [ 2, 3 ], 2 ]],
                    well_formed_scale: [edo12.get.well_formed_scale,[5],[0,2,4,7,9]],
                    without_chromatic_notes: [edo12.get.without_chromatic_notes,[[12,10,9,8,7,6,8,10,11,12,10,9,8,7,6,8,10,11,12,14,19,15]],[12, 6, 8, 12, 6, 8, 12, 14, 19, 15]],
                }

                for(let test_name in tests) {
                    it(test_name,function(){
                        tests[test_name][0](...tests[test_name][1]).should.be.eql(tests[test_name][2])
                    })
                }
            })
        });
        describe('EDO.is', function () {
            describe('Deterministic tests in 12EDO', function () {
                let tests = {
                    element_of: [edo12.is.element_of,[[2,4],[[1,2,3,4],[1,2,4],[2,4]]],true],
                    rotation: [edo12.is.rotation,[[0,2,4,5,7,9,11],[2,4,5,7,9,11,0]],true],
                    same: [edo12.is.same,[[2,4],[4,2]],false],
                    subset: [edo12.is.subset,[[2,4],[1,2,3,4,5]],true],
                    transposition: [edo12.is.transposition,[[0,2,4,5,7,9,11],[5,7,9,10,0,2,4]],true]

                }
                for(let test_name in tests) {
                    it(test_name,function(){
                        tests[test_name][0](...tests[test_name][1]).should.be.eql(tests[test_name][2])
                    })
                }
            })
        })
    })

    describe("Scale Class Unit Tests", function () {
        describe('Scale.count', function () {
            describe('Deterministic tests in 12EDO', function () {
                let tests = {
                    chord_quality:[dia.count.chord_quality,[[4, 7, 11]],2],
                    consecutive_steps:[dia.count.consecutive_steps,[2],3],
                    imperfections:[dia.count.imperfections,[],1],
                    count: [dia.count.interval,[[3,4]],7],
                    M3s: [dia.count.M3s,[],3],
                    m3s: [dia.count.m3s,[],4],
                    major_minor_triads:[dia.count.major_minor_triads,[],6],
                    modes: [WT.count.modes,[],1],
                    n_chords: [penta.count.n_chords,[],15],
                    P5s: [dia.count.P5s,[],6],
                    pitches: [dia.count.pitches,[],7],
                    rahn_differences: [dia.count.rahn_differences,[],56],
                    rahn_contradictions: [dia.count.rahn_contradictions,[],0],
                    rahn_ambiguities: [dia.count.rahn_ambiguities,[],1],
                    // ratio: dia.count.ratio(),
                    rotational_symmetries: [octa.count.rotational_symmetries,[],4],
                    // simple_ratios: dia.count.simple_ratios()
                    tetrachords: [dia.count.tetrachords,[],20],
                    thirds: [dia.count.thirds,[],7],
                    // transpositions: dia.count.transpositions(),
                    trichords: [dia.count.trichords,[],15],
                    unique_elements: [dia.count.unique_elements,[[2]],6]

                }
                for(let test_name in tests) {
                    it(test_name,function(){
                        tests[test_name][0](...tests[test_name][1]).should.be.eql(tests[test_name][2])
                    })
                }
            })
        })
        describe('Scale.get', function () {
            describe('Deterministic tests in 12EDO', function () {
                let tests = {
                    area: [maj3.get.area,[],0.376564638493296],
                    diagnostic_intervals: [dia.get.diagnostic_intervals,[],[6]],
                    set_difference: [f6f7.get.set_difference,[], {valid: true,alterations: 2,delta: [0, 0, 0, 0, 0, -1, -1],mode: [0, 2, 4, 5, 7, 8, 10]}],
                    per_note_set_difference: [f6f7.get.per_note_set_difference,[],[0, 0, 0, 0, 0, 1, 1]],
                    coordinates: [min3.get.coordinates,[], [[0,0.56418958354776],[0.56418958354776,3.454664838020213e-17],[-0.2820947917738801,-0.48860251190292314]]],
                    common_tone_transpositions: [min3.get.common_tone_transpositions,[], [{"altered_tones": 0,"as_scale_degree": 1,"common_tone": 0,"common_tones": 3,"transposition": [0,3,7]},{"altered_tones": 2,"as_scale_degree": 2,"common_tone": 0,"common_tones": 1,"transposition": [0,4,9]},{"altered_tones": 2,"as_scale_degree": 3,"common_tone": 0,"common_tones": 1,"transposition": [0,5,8]},{"altered_tones": 2,"as_scale_degree": 1,"common_tone": 3,"common_tones": 1,"transposition": [3,6,10]},{"altered_tones": 0,"as_scale_degree": 2,"common_tone": 3,"common_tones": 3,"transposition": [3,7,0]},{"altered_tones": 2,"as_scale_degree": 3,"common_tone": 3,"common_tones": 1,"transposition": [3,8,11]},{"altered_tones": 2,"as_scale_degree": 1,"common_tone": 7,"common_tones": 1,"transposition": [7,10,2]},{"altered_tones": 2,"as_scale_degree": 2,"common_tone": 7,"common_tones": 1,"transposition": [7,11,4]},{"altered_tones": 0,"as_scale_degree": 3,"common_tone": 7,"common_tones": 3,"transposition": [7,0,3]}]],
                    complement: [dia.get.complement,[],[1, 3, 6, 8, 10]],
                    chord_quality_from_shape: [dia.get.chord_quality_from_shape,[[1,3,4,5,7],7],[11, 2, 4, 5, 9]],
                    melody_from_intervals: [dia.get.melody_from_intervals,[[7,-1,-2,1,1,1,-7,5,-1,-6,5,-1]],[0, 12, 11, 7,  9, 11, 12,  0,  9, 7, -3,  5, 4]],
                    generic_intervals: [dia.get.generic_intervals,[3], [{"generic":3,"specific":5,"pitches":[[0,5],[2,7],[4,9],[7,0],[9,2],[11,4]],"instances":6},{"generic":3,"specific":6,"pitches":[[5,11]],"instances":1} ]],
                    specific_intervals: [dia.get.specific_intervals,[6], [{"generic":"3","specific":6,"pitches":[[5,11]],"instances":1},{"generic":"4","specific":6,"pitches":[[11,5]],"instances":1}]],
                    interval_vector: [dia.get.interval_vector,[],[ 2, 5, 4, 3, 6, 1 ]],
                    inversion: [dia.get.inversion,[],[0, 2, 4, 6, 7, 9, 11]],
                    // least_step_multiplier:[],
                    lerdahl_attraction: [dia.get.lerdahl_attraction,[1,0],4],
                    lerdahl_attraction_vector: [dia.get.lerdahl_attraction_vector,[],['*','<>','*','<>','*','<<','>>']],
                    levenshtein: [penta.get.levenshtein,[[0,2,4,5,7,9,11]],2],
                    myhill_property: [penta.get.myhill_property,[],true],
                    modes: [penta.get.modes,[],[[ 0, 2, 4, 7, 9 ],[ 0, 2, 5, 7, 10 ],[ 0, 3, 5, 8, 10 ],[ 0, 2, 5, 7, 9 ],[ 0, 3, 5, 7, 10 ]]],
                    // motives_diatonic: [scale.get.motives_diatonic,[[8,7,7,8,7,7,8,7,7,15,15,14,12,12,10,8,8,7,5,5]],[{ motive: [ 0 ], incidence: 9 },{ motive: [ -1 ], incidence: 6 },{ motive: [ -1, 0 ], incidence: 5 } ]],
                    n_chords: [penta.get.n_chords,[3], [[ 0, 2, 4 ],[ 0, 2, 7 ],[ 0, 3, 5 ],[ 0, 4, 7 ],[ 0, 3, 7 ],[ 0, 2, 5 ] ]],
                    // n_chords_diatonic: [],
                    // name: [],
                    neighborhood: [maj3.get.neighborhood,[1,1,true,true], [[ 0, 4, 8 ],[ 0, 4, 6 ],[ 0, 2, 7 ],[ 0, 3, 7 ],[ 0, 3, 6 ] ]],
                    normal_order: [dia.get.normal_order,[],[0, 1, 3, 5, 6, 8, 10]],
                    // pairwise_generic_specific_intervals: [dia.get.pairwise_generic_specific_intervals,[],[0, 1, 3, 5, 6, 8, 10]],
                    permutations: [min3.get.permutations,[], [[0,3,7],[0,7,3],[3,0,7],[3,7,0],[7,0,3],[7,3,0]]],
                    pitches: [dia.get.pitches,[],[0,2,4,5,7,9,11]],
                    position_of_quality: [dia.get.position_of_quality,[[0,4,7]],[0,5,7]],
                    prime_form: [dia.get.prime_form,[],[0, 1, 3, 5, 6, 8, 10]],
                    product: [penta.get.product,[5,true],[ 0, 8, 9, 10, 11 ]],
                    // quality_with_intervals: [],
                    rotations: [min3.get.rotations,[],[[0,3,7],[3,7,0],[7,0,3]]],
                    rothenberg_propriety: [penta.get.rothenberg_propriety,[], "strictly proper"],
                    roughness: [penta.get.roughness,[false, 440],0.21543265646088483],
                    sameness_quotient: [dia.get.sameness_quotient,[], 0.5555555555555556],
                    coherence_quotient: [penta.get.coherence_quotient,[],1],
                    scale_degree_transpositions: [dia.get.scale_degree_transpositions,[],[[ [0, 2, 4, 5, 7, 9, 11], 0 ],[ [0, 2, 4, 5, 7, 9, 10], 1 ],[ [0, 2, 4, 6, 7, 9, 11], 1 ],[ [1, 2, 4, 6, 7, 9, 11], 2 ],[ [1, 2, 4, 6, 8, 9, 11], 3 ],[ [1, 3, 4, 6, 8, 9, 11], 4 ],[ [1, 3, 4, 6, 8, 10, 11], 5 ] ]],
                    segments: [dia.get.segments,[],[[2,2],[1],[2,2,2],[1]]],
                    sequence_transposition: [penta.get.sequence_transposition,[[0,2,4],1], [ 2, 4, 7 ]],
                    // shortest_path: [],
                    stacks: [dia.get.stacks,[5,2], [[ 0, 5, 11, 4, 9 ],[ 0, 5, 10, 3, 9 ],[ 0, 5, 10, 3, 8 ],[ 0, 6, 11, 4, 9 ],[ 0, 5, 10, 4, 9 ] ]],
                    step_sizes: [dia.get.step_sizes,[],[1,2]],
                    steps_to_qualities: [dia.get.steps_to_qualities,[[1,1]], {"steps":[1,1],"combos":[{"quality":[0,2,4],"positions":[0,5,7]},{"quality":[0,2,3],"positions":[2,9]},{"quality":[0,1,3],"positions":[4,11]}]}],
                    supersets: [min3.get.supersets,[[[0,1,2,3,4,5,6,7],[0,3,4,7],[0,1,2]]],[[0,1,2,3,4,5,6,7],[0,3,4,7]]],
                    tetrachords: [penta.get.tetrachords,[],[ [ 0, 2, 4, 7 ], [ 0, 3, 5, 7 ], [ 0, 2, 5, 7 ], [ 0, 3, 5, 8 ] ]],
                    scale_degree_roles: [penta.get.scale_degree_roles,[],[ [ 1, 2, 3, 5, 6 ]]],
                    transposition: [penta.get.transposition,[5],[ 5, 7, 9, 0, 2 ]],
                    transpositions_with_pitches: [dia.get.transpositions_with_pitches,[[1,4,8]], [{pitches: [9,11,1,2,4,6,8], common_tones: 4}, {pitches: [4,6,8,9,11,1,3], common_tones: 3}, {pitches: [11,1,3,4,6,8,10], common_tones: 2}  ]],
                    trichords: [penta.get.trichords,[], [[ 0, 2, 4 ],[ 0, 2, 7 ],[ 0, 3, 5 ],[ 0, 4, 7 ],[ 0, 3, 7 ],[ 0, 2, 5 ] ]],
                    without: [dia.get.without,[[5,11]],[0,2,4,7,9]]




                }
                for(let test_name in tests) {
                    it(test_name,function(){
                        tests[test_name][0](...tests[test_name][1]).should.be.eql(tests[test_name][2])
                    })
                }
            })
        })
        describe('Scale.is', function () {
            describe('Deterministic tests in 12EDO', function () {
                let tests = {
                    deep: [dia.is.deep,[],true],
                    distributionally_even: [dia.is.distributionally_even,[],true],
                    in_lower_edos: [dimdim.is.in_lower_edos,[],[4]],
                    invertible: [dia.is.invertible,[],false],
                    maximally_even: [dia.is.maximally_even,[],true],
                    myhill_property: [dia.is.myhill_property,[],true],
                    mode_of: [dia.is.mode_of,[[0,2,3,5,7,9,10]],true],
                    MOLT: [WT.is.MOLT,[],true],
                    normal_order: [dia.is.normal_order,[],false],
                    one_of: [dia.is.one_of,[[[0,2,3,5,7,9,10],[0,1,2,3,4,5,6,7,8,9]]],true],
                    prime_form: [dia.is.prime_form,[],false],
                    subset:[dia.is.subset,[[[0,2,4,5],[7,9,11]]], false]




                }
                for(let test_name in tests) {
                    it(test_name,function(){
                        tests[test_name][0](...tests[test_name][1]).should.be.eql(tests[test_name][2])
                    })
                }
            })
        })
        describe('Scale.to', function () {
            describe('Deterministic tests in 12EDO', function () {
                let tests = {
                    cents: [dia.to.cents,[],[0,200,400,500,700,900,1100]],
                    steps: [dia.to.steps,[],[2,2,1,2,2,2,1]]

                }
                for(let test_name in tests) {
                    it(test_name,function(){
                        tests[test_name][0](...tests[test_name][1]).should.be.eql(tests[test_name][2])
                    })
                }
            })
        })
    })


    }

unit_tests()