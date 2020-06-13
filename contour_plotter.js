const contour = function (container_id, size =600, pitches = [0,2,4,5,7,9,11,21,-3]) {
    let height = size
    let width = size

    let div = document.createElement('div')
    div.style.width = width + "px";
    div.style.height = height + "px";
    div.style.display = "inline"
    let div_id = div.setAttribute("id", "paper_" + Date.now());
    let container = document.getElementById(container_id)

    container.appendChild(div)
    // let width = container.offsetWidth
    // let height = container.offsetWidth
    const paper = new Raphael(div, width, height);
    let background = paper.rect(0, 0, width, height).attr('fill', '000').attr('stroke','white')

    const scale = (num, in_min, in_max, out_min, out_max) => {
        return (num - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
    }

    let max_pitch = Math.max.apply(Math,pitches)
    let min_pitch = Math.min.apply(Math,pitches)
    let margin = 15
    let scaled_pitches = pitches.map((pitch) => Math.floor(scale(pitch,min_pitch,max_pitch,height-margin,margin)))
    let pos = margin
    let pos_shift = Math.floor((width-(margin*2))/(pitches.length-1))
    let path_str = "M"+margin+"," + scaled_pitches[0]
    let circle_set = paper.set()
    let circle_r = height/45
    circle_set.push(paper.circle(margin,scaled_pitches[0],circle_r))
    for (let i=1;i<scaled_pitches.length;i++) {
        pos+=pos_shift
        path_str+="L" + pos +"," + scaled_pitches[i]
        circle_set.push(paper.circle(pos,scaled_pitches[i],circle_r))
    }
    let path = paper.path(path_str).attr('stroke','red').attr('stroke-width',2)
    circle_set.attr('fill','white')
    circle_set.toFront()




}

