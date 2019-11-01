function handleFunction(fun, params, id) {
  new Promise((res, rej) => {
    params ? fun(params) : fun();
    res();
  }).finally(() => {
    document.getElementById(id).remove();
  });
}
