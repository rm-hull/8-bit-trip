export function validate(s) {
  if (/^[0-9\+\-\/\*\%\&\|\^\<\>t\(\) ]+$/.test(s)) {
    return s;
  }
  throw new Error("Invalid expression: " + s);
}

export function* compute(expr) {
  validate(expr);
  var t = 0;
  while (true) {
    yield eval(expr);
    t++;
  }
}

