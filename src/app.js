import express from "express";

import { audioStream } from "./audio-encoder";
import { validate, compute } from "./equation";
import { shortLittleEndian } from "./byte-converters";
import { flatMap } from "./generators";

function comp(f, g) {
  return (x) => g(f(x));
}

function upscale8bit(n) {
  return 0xFF * (0xFF & n);
}

const app = express();

app.get("/:eqn", (req, res) => {

  let eqn = flatMap(
    //comp(upscale8bit, shortLittleEndian),
    function*(n) { yield n & 0xFF; },
    compute(req.params.eqn));

  res.type("audio/x-wav");
  audioStream(eqn, 8000, 8).pipe(res, "binary");
});

app.listen(3000);
