/*shows a single necklace*/
const show_necklace = function (container_id, size =600, pitches = [0,2,4,5,7,9,11],edo=12) {
    let height=size
    let width=size

    let div = document.createElement('div')
    div.style.width =width+"px";
    div.style.height =height+"px";
    div.style.display="inline"
    let div_id = div.setAttribute("id", "paper_" + Date.now());
    let container = document.getElementById(container_id)

    container.appendChild(div)
    // let width = container.offsetWidth
    // let height = container.offsetWidth
    const paper = new Raphael(div, width, height);
    let background = paper.rect(0,0,width,height).attr('fill','000')

    const scale = (num, in_min, in_max, out_min, out_max) => {
        return (num - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
    }

    class Necklace {
        constructor(radius=paper.height/2-(height/10),cx=paper.width/2,cy=paper.height/2,edo=12,pitches = [0,2,4,5,7,9,11]) {
            //general parameters
            this.cx = cx
            this.cy = cy
            this.radius = radius
            this.edo = edo
            this.pitches = pitches

            //ring (will store the ring object)
            this.ring

            //nodes
            this.nodes = []

            //strings
            this.strings = []

            this.update(pitches)
        }

        update (pitches) {
            this.pitches=pitches
            this.draw_all()
        }
        draw_all (){
            this.draw_ring()
            this.draw_nodes()
            this.draw_strings()

            for(let node of this.nodes) {
                node.drawing.toFront()
                node.text.toFront()
            }


        }
        draw_ring () {
            //if already exists, remove the old one
            if(this.ring) {
                this.ring.remove()
                this.ring=undefined
            }

            //draw the ring
            this.ring = paper.circle(this.cx,this.cy,this.radius).attr('stroke','red')
                .attr('stroke-width',3)
                .attr("text",'HELLO!!')
        }
        draw_nodes () {
            let pitches = this.pitches

            //remove nodes
            for(let node of this.nodes) {
                node.drawing.remove()
                node.text.remove()
            }
            this.nodes = []
            let radius = Math.min((this.radius*2*Math.PI / this.edo)/2-5,15)
            //node parameters
            for(let note=0;note<this.edo;note++) {
                let angle = (note * (360 / this.edo)) - 90
                let rad_angle = angle * Math.PI / 180
                let cx = Math.floor(this.cx + (this.radius * Math.cos(rad_angle)))
                let cy = Math.floor(this.cy + (this.radius * Math.sin(rad_angle)))
                let node = new Node(radius,cx,cy,note,pitches.indexOf(note)!=-1)
                this.nodes.push(node)
            }


            for(let node of this.nodes) {
                node.draw()
            }
        }

        draw_strings () {
            //remove strings
            for(let string of this.strings) {
                string.drawing.remove()
            }
            this.strings = []



            for(let i=0;i<this.nodes.length-1;i++) {
                if(!this.nodes[i].visible) continue //if this node is not visible, skip it
                for(let j=i+1;j<this.nodes.length;j++) {
                    if(!this.nodes[j].visible) continue //if this node is not visible, skip it
                    // strings.push([i,j]) //the pitches for which the strings are connected
                    let n1 = this.nodes[i]
                    let n2 = this.nodes[j]
                    this.strings.push(new Str(n1.cx,n1.cy,n2.cx,n2.cy))
                }
            }

            for(let string of this.strings) {
                string.draw()
            }
        }
    }

    class Node {
        constructor(radius=height/20,cx=paper.width/2,cy=paper.height/2,name="",visible=true) {
            this.radius = radius
            this.cx=cx
            this.cy=cy
            this.name =name
            this.visible = visible

        }

        draw () {


            //if already exists, remove the old one
            if(this.drawing) {
                this.drawing.remove()
                this.drawing=undefined
            }

            this.drawing = paper.set()

            this.circle = paper.circle(this.cx,this.cy,this.radius)
                .attr('stroke','red')
                .attr('fill','blue')
            this.drawing.push(this.circle)

            this.text = paper.text(this.cx,this.cy,this.name)
                .attr('fill','white')
                .attr('font-size',this.radius)

            this.drawing.push(this.text)

            if(this.visible) {
                this.drawing.show()
            }
            else {
                this.drawing.hide()
            }


        }
    }

    class Str {
        constructor(x1,y1,x2,y2) {
            this.x1 = x1
            this.y1=y1
            this.x2= x2
            this.y2 = y2
            this.length = Math.sqrt((x2-x1)**2 + (y2-y1)**2)
        }

        draw () {
            //if already exists, remove the old one
            if(this.drawing) {
                this.drawing.remove()
                this.drawing=undefined
            }

            let hue = Math.floor(scale(this.length,0,height-100,0,360))
            let rgb = Raphael.hsl2rgb(hue,100,50)
            this.drawing = paper.path("M" + this.x1+"," + this.y1 +"L" + this.x2 +"," + this.y2)
                .attr('stroke',rgb.hex)
                .attr('stroke-width',3)

        }

    }

    let necklace = new Necklace(paper.height/2-(height/10),paper.width/2,paper.height/2,edo,pitches)

    return necklace
}

/*calls show_necklace for many necklaces*/
const make_necklaces = function (container_id,size=300,necklaces,edo=12) {
    let list = []
    for (let necklace of necklaces) {
        list.push(show_necklace(container_id,size,necklace,edo))
    }
}





