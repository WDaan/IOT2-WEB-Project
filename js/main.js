let chart

$(document).ready(function () {
    drawChart();
})

function handleFunction(fun, params, id) {
    new Promise((res, rej) => {
        params ? fun(params) : fun();
        res();
    }).finally(() => {
        document.getElementById(id).remove();
    });
}

function drawTable(data, prepend) {
    data.forEach(el => {
        //rij
        let trow = document.createElement("tr");
        trow.classList.add("trow");
        trow.id = el.id;
        //data cols
        let tijd = document.createElement("th");
        let expected = document.createElement("td");
        let word = document.createElement("td");

        //data toevoegen
        tijd.innerHTML = el.time;
        expected.innerHTML = el.expected;
        word.innerHTML = el.word;

        //styling
        expected.setAttribute("align", "center");
        word.setAttribute("align", "center");

        //adding to table
        trow.appendChild(tijd);
        trow.appendChild(expected);
        trow.appendChild(word);

        prepend ? tbody.prepend(trow) : tbody.append(trow);
    });

    if (localStorage.getItem('history')) {
        let ids = JSON.parse(localStorage.getItem('history'));
        if (ids.length >= 30) {
            let remove = ids.splice(data.length);
            console.log(remove);
            remove.forEach(el => document.getElementById(el).remove());
            //enkel oveblijvende ids
            localStorage.setItem('history', JSON.stringify(ids));
        }
    }
    else
        localStorage.setItem('history', JSON.stringify(data.map(el => el.id)));

}


function setLeds(color) {
    const format = str_pad(color.b, 3) + str_pad(color.g, 3) + str_pad(color.r, 3)
    $.ajax({
        type: "GET",
        url: "http://pi4:3000/color?color=${format}`",
        error: function () {
            console.error("Couldn't set color");
        }
    });
    document.getElementById("color").innerHTML = `bgr(${color.b},${color.g},${color.r})`
}


function drawChart() {
    axios.get("http://pi4:3000/counter", {}).then(res => {
        const ctx = document.getElementById('myChart').getContext('2d');
        chart = new Chart(ctx, {
            // The type of chart we want to create
            type: 'pie',

            // The data for our dataset
            data: {
                labels: ['Correct', 'Incorrect'],
                datasets: [{
                    backgroundColor: [
                        'hsl(141, 71%, 48%)	',
                        'hsl(348, 100%, 61%)'
                    ],
                    data: [res.data[0].value, res.data[1].value],
                    borderWidth: [0.4, 0.4]
                }]
            },
        });
    }).catch(err => console.log('Couldn\'t retrieve data'));
}


function recognise(expected) {
    if (expected != '' && expected != null && expected != undefined) {
        expected = expected.toLowerCase();
        axios.get(`http://pi4:3000/result?expected=${expected}`).then(res => {
            if (res.status != 409)
                document.getElementById('result').innerHTML = res.data;
            drawChart();
        }).catch(err => {
            document.getElementById('result').innerHTML = 'Nothing found';
        });
    } else {
        alert('Please enter an expected word')
    }
}
