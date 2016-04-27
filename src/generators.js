
export function* flatten(...generators) {
  for (let gen of generators) {
    for (let n of gen) {
      yield n;
    }
  }
}

export function* flatMap(f, gen) {
  for (let n of gen) {
    for (let i of f(n)) {
      yield i;
    }
  }
}
