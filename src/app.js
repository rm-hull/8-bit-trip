import express from "express";

import { audioStream } from "./audio-encoder";
import { validate, compute } from "./equation";
import { shortLittleEndian } from "./byte-converters";
import { flatMap } from "./generators";

function logErrors(err, req, res, next) {
  console.error(err.stack);
  next(err);
}

function errorHandler(err, req, res, next) {
  res.status(500);
  res.render("Error", { error: err });
}

const app = express();

app.use(express.static("public"));
app.use(logErrors);
app.use(errorHandler);

app.get("/:eqn", (req, res) => {

  let eqn = flatMap(
    function*(n) { yield n & 0xFF; },
    compute(req.params.eqn));

  res.type("audio/x-wav");
  audioStream(eqn, 8000, 8).pipe(res, "binary");
});

app.listen(3000);
