function setLeds(color) {
    const format = str_pad(color.b, 3) + str_pad(color.g, 3) + str_pad(color.r, 3)
    axios.get(`http://pi4:3000/color?color=${format}`).then(res => {
        console.log(res);
    })
}

function str_pad(num, size) {
    var s = num + "";
    while (s.length < size) s = "0" + s;
    return s;
}