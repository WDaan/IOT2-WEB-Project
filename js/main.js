function handleFunction(fun, params, id) {
  new Promise((res, rej) => {
    params ? fun(params) : fun();
    res();
  }).finally(() => {
    document.getElementById(id).remove();
  });
}
function drawTable(data) {
  data.forEach(el => {
    //rij
    let trow = document.createElement("tr");
    trow.classList.add("trow");
    trow.id = el.id;
    //data cols
    let tijd = document.createElement("th");
    let temp = document.createElement("td");
    let speed = document.createElement("td");

    //data toevoegen
    tijd.innerHTML = el.time;
    temp.innerHTML = el.temp;
    speed.innerHTML = el.speed;

    //styling
    tijd.setAttribute("align", "center");
    temp.setAttribute("align", "center");
    speed.setAttribute("align", "center");

    //adding to table
    trow.appendChild(tijd);
    trow.appendChild(temp);
    trow.appendChild(speed);

    tbody.append(trow);
  });
}
