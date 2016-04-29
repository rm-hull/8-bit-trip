export function validate(s) {
  if (/^[0-9\+\-\/\*\%\&\|\^\<\>etvxy\=\?\:\(\)\[\]\" ]+$/.test(s)) {
    var t = 0;
    var v = 0;
    var x = 0;
    var y = 0;
    var res = eval(s);
    return s;
  }
  throw new Error("Invalid expression: " + s);
}

export function* compute(expr) {
  var t = 0;
  var v = 0;
  var x = 0;
  var y = 0;
  while (true) {
    yield eval(expr);
    t++;
  }
}

