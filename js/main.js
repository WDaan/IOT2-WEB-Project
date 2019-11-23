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
   // tijd.setAttribute("align", "center");
   // word.setAttribute("align", "center");

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