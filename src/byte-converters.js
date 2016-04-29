
export function* str(text) {
  for (let ch of text) {
    yield ch.charCodeAt(0);
  }
}

export function* intLittleEndian(n) {
  yield 0xFF & n;
  yield 0xFF & (n >> 8);
  yield 0xFF & (n >> 16);
  yield 0xFF & (n >> 24);
}

export function* shortLittleEndian(n) {
  yield 0xFF & n;
  yield 0xFF & (n >> 8);
}

export function* byteClip(n) {
  yield 0xFF & n;
}

