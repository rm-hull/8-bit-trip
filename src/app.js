import express from "express";

import { audioStream } from "./audio-encoder";
import { validate, compute } from "./equation";
import { shortLittleEndian, byteClip } from "./byte-converters";
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

app.get("/:hz/:expr", (req, res) => {

  let hz = parseInt(req.params.hz);
  let expr = validate(req.params.expr);
  let gen = flatMap(byteClip, compute(expr));

  res.type("audio/x-wav");
  audioStream(gen, hz, 8).pipe(res, "binary");
});

app.listen(3000);
