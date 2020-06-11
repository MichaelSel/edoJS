const point_on_circle = function (center = [0,0], radius = 50, angle = 90) {
    /*Finding the x,y coordinates on circle, based on given angle*/

    //center of circle, angle in degree and radius of circle
    angle = angle * Math.PI/180
    let x = Math.floor(center[0] + (radius * Math.cos(angle)))
    let y = Math.floor(center[1] + (radius * Math.sin(angle)))

    return [x,y]
}
const mod = (n, m) => {
    return ((n % m) + m) % m;
}
const scale = (num, in_min, in_max, out_min, out_max) => {
    return (num - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
}
let container = document.getElementById('container')
let width = container.offsetWidth
let height = container.offsetWidth
const paper = new Raphael(container, width, height);
let edo = 12

const interval_fractal_tree = function (length = 200,angle_span=90,mode=[0,2,4,5,7,9,11],intervals=[-1,1],keep_alive=true,save_image=false, edo=12, iterations=5,length_mul=0.7) {
    paper.clear()
    let background = paper.rect(0,0,width,height).attr('fill','000')
    let tree = new Branch(length=length,
        angle=0,
        x=Math.floor(width/2),
        y=height,
        circle_r=20,
        angle_span=angle_span,
        length_mul=length_mul,
        iterations = iterations,
        intervals=intervals,
        starting_pitch=0,
        mode=mode,
        iterations=iterations)
    tree.draw_branch()
}
class Branch {
    constructor(length=300,angle=0,x=0,y=0,circle_r = 20,angle_span=90,length_mul=0.70,iterations=5,intervals=[-1,1],starting_pitch=0,mode=null) {
        if(mode) this.diatonic = true
        else this.diatonic=false
        
        this.mode = mode
        this.iterations=iterations
        this.length_mul = length_mul
        this.angle_span=angle_span
        this.length = length
        this.angle = angle
        this.circle_r = circle_r
        this.circle_o = point_on_circle([x,y],length-(circle_r),angle-90)
        this.start = [x, y]
        this.line_center = point_on_circle(this.start, (this.length - (this.circle_r * 2))/2, this.angle-90)
        this.line_end = point_on_circle(this.start, this.length - (this.circle_r * 2), this.angle-90)
        this.end = point_on_circle([x,y],length,angle-90)
        this.sub_branches=intervals.length
        this.intervals = intervals
        this.starting_pitch = starting_pitch
    }

    draw_branch () {
        let start = this.start
        let end = this.line_end
        paper.path('M'+start.join(',') + 'L' + end.join(',')).attr('stroke','white')
        let c_center = this.circle_o
        let hue = Math.floor(scale(this.starting_pitch,0,edo - 1,0,360))
        let rgb = Raphael.hsl2rgb(hue,100,50)
        paper.circle(c_center[0],c_center[1],this.circle_r).attr('fill',rgb)
        this.text = paper.text(c_center[0],c_center[1],this.starting_pitch)
            .attr('fill','blue')
            .attr('font-size',25)

        if(this.iterations>0) {
            let angle_span = Math.floor(this.angle_span/2)-this.angle_span
            let angle_add = this.angle_span/(this.sub_branches-1)
            let new_length = this.length*this.length_mul
            for(let i=0;i<this.sub_branches;i++) {
                let starting_pitch = 100
                if(this.diatonic) {
                    let index = this.mode.indexOf(this.starting_pitch)
                    starting_pitch = this.mode[mod((index + this.intervals[i]),this.mode.length)]
                } else {
                    starting_pitch = mod((this.starting_pitch+this.intervals[i]),edo)
                }
                let new_angle = this.angle + angle_span+(i*angle_add)
                let new_x = this.end[0]
                let new_y = this.end[1]
                let new_branch = new Branch(new_length, new_angle,new_x,new_y,this.circle_r, this.angle_span, this.length_mul,  this.iterations-1,  this.intervals,  starting_pitch,this.mode)
                new_branch.draw_branch()

            }
        }
    }
}
