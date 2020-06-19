const EDO = require("./edo")

let edo = new EDO(12)

let scale = edo.scale([0,2,4,5,7,9,11])

// console.log(edo.convert.interval_to_ratio(7))
// console.log(edo.convert.ratio_to_interval(1.5))
// console.log(edo.convert.ratio_to_cents(1.5))
// console.log(edo.convert.interval_to_cents(3))
// console.log(edo.convert.intervals_to_scale([2,2,1,2,2,2,1]))
// console.log(edo.convert.cents_to_ratio(700))
// console.log(edo.convert.midi_to_name([0,2,4,5,7,9,11],60))
// console.log(edo.convert.pc_to_name([0,2,4,5,7,9,11]))
// console.log(edo.convert.intervals_to_pitches([2,2,2,2,2,2]))
// console.log(edo.convert.midi_to_intervals([60,62,64,65,67,69,71]))
// console.log(edo.convert.name_to_scale('12-1495'))
// console.log(edo.convert.to_steps([0,2,4,5,7,9,11]))
//
// console.log(edo.get.permutations([0,2,3]))
// console.log(edo.get.subset_indices([0,2,3],[0,0,2,0,2,3]))
// console.log(edo.get.ratio_approximation(7))
// console.log(edo.get.interval_stack([2,3],3,true))
// console.log(edo.get.path_on_tree([2,3,4],[0,1,0,1,1,1,2]))
// console.log(edo.get.motives([0,1,3,0,1,3,4,3,4,0,1,0,1]))
// console.log(edo.get.motives_diatonic([4,9,7,5,11,9,7],[0,2,4,5,7,9,11]))
// console.log(edo.get.shortest_path(-5,[3,4],[-7]))
// console.log(edo.get.shortest_path(7,3,-8))
// console.log(edo.get.path_n_steps(7,[[0,2,4],[3,2,1]],8))
// console.log(edo.get.scales(1,3,2,3))
// console.log(edo.get.necklace([0,2,4,5,6,8,9]))
// console.log(edo.get.simple_ratios())
// console.log(edo.get.inversion([0,2,4,5,8]))
// console.log(edo.get.normal_order([0,2,4,5,8]))
// console.log(edo.get.modes([0,2,4,5,8]))
// console.log(edo.get.interval_shift([2,3,-2,1,4,-7]))
// console.log(edo.get.subsets([0,2,3,4],true))
// console.log(edo.get.contour([0,2,3,4],false))
// console.log(edo.get.pitch_distribution([0,2,0,2,3,4,2,2,2,2,2,0,1,2,0]))
// console.log(edo.get.transposition([0,2,4,6,2,4,5,1,2,5,4,5,8,7],5))
//
// console.log(edo.is.subset([0,2,3],[3,2,1,0,1,2,3]))
//
// console.log(edo.count.pitches([0,3,3,2,4,3,4]))
//
//
// console.log(scale.count.transpositions())
// console.log(scale.count.imperfections())
// console.log(scale.count.interval([3,4]))
// console.log(scale.count.P5s())
// console.log(scale.count.M3s())
// console.log(scale.count.m3s())
// console.log(scale.count.thirds())
// console.log(scale.count.pitches())
// console.log(scale.count.rotational_symmetries())
// console.log(scale.count.modes())
// console.log(scale.count.chord_quality([0,[3,4],7]))
// console.log(scale.count.major_minor_triads())
// console.log(scale.count.trichords())
// console.log(scale.count.tetrachords())
// console.log(scale.count.ratio(5/4,30))
// console.log(scale.count.simple_ratios())
// console.log(scale.count.consecutive_steps(1))
//
// console.log(scale.get.name())
// console.log(scale.get.modes())
// console.log(scale.get.pitches())
// console.log(scale.get.interval_vector())
// console.log(scale.get.trichords())
// console.log(scale.get.tetrachords())
// console.log(scale.get.stacks(3, 1))
// console.log(scale.get.common_tone_transpositions())
// console.log(scale.get.supersets([[0,1,2,3,4,5,6,7],[0,3,4,7],[0,1,2]]))
// console.log(scale.get.rotations())
// console.log(scale.get.permutations())
// console.log(scale.get.position_of_quality([0,4,7]))
// console.log(scale.get.lerdahl_attraction(4,0))
// console.log(scale.get.lerdahl_attraction_vector())
// console.log(scale.get.least_step_multiplier())
// console.log(scale.get.step_sizes())
// console.log(scale.get.rothenberg_propriety())
// console.log(scale.get.levenshtein([0,1,2]))
// console.log(scale.get.shortest_path(2,2,-1))
// console.log(scale.get.inversion())
// console.log(scale.get.prime_form())
// console.log(scale.get.lattice(3,4,true))
// console.log(scale.get.normal_order())
// console.log(scale.get.transposition(5))

// console.log(scale.to.steps())
// console.log(scale.to.cents())
//
// console.log(scale.is.one_of([[0,1,4,5,7,8,11],[1,3,5,7,9,10]]))
// console.log(scale.is.normal_order())
// console.log(scale.is.prime_form())
// console.log(scale.is.invertible())
// console.log(scale.is.subset([[0,1,4,5,7,8,9],[0,1,4,5,7,8,11]]))
// console.log(scale.is.in_lower_edos())
//
// console.log(scale.export.scala())