let chart

$(document).ready(function () {
    drawChart();
})

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