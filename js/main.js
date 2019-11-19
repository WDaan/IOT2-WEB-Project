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
