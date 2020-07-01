var ctx = new AudioContext();


const play_note = function (freq,adsr = [[1,100],[0.7,150],300,300],wavetype="square"){
    // Create a "gain node", which we'll use to play our notes
    var gainNode = ctx.createGain();
    gainNode.connect(ctx.destination);

    var o = gainNode.context.createOscillator();
    o.type = wavetype
    o.connect(gainNode);
    o.frequency.value = freq;
    let start = ctx.currentTime
    let offset = 0

    // At note=0%, volume should be 0%
    gainNode.gain.setValueAtTime(0, start+offset);


    // attack
    offset+= adsr[0][1]/1000
    gainNode.gain.linearRampToValueAtTime(adsr[0][0], start + offset);

    // decay
    offset+= adsr[1][1]/1000
    gainNode.gain.linearRampToValueAtTime(adsr[1][0], start + offset);

    // sustain
    offset+= adsr[2]/1000
    gainNode.gain.setValueAtTime(adsr[1][0], start + offset);



    //release
    offset+= adsr[3]/1000
    gainNode.gain.linearRampToValueAtTime(0, start + offset);

    o.start(start);
    o.stop(start + offset);


}
