import express from "express";
import cluster from "cluster";
import _ from "lodash";

import { audioStream } from "./audio-encoder";
import { validate, compute } from "./equation";
import { shortLittleEndian, byteClip } from "./byte-converters";
import { flatMap } from "./generators";

const spawnCount = 16;
const port = 3000;

function server(port) {
  const app = express();

  const logErrors = (err, req, res, next) => {
    console.error(err.stack);
    next(err);
  }

  const errorHandler = (err, req, res, next) => {
    res.status(500);
    res.render("Error", { error: err });
  }

  app.use(express.static("public"));
  app.use(logErrors);
  app.use(errorHandler);

  app.get("/:hz/:expr", (req, res) => {

    let hz = parseInt(req.params.hz);
    let expr = validate(req.params.expr);
    let gen = flatMap(byteClip, compute(expr));

    console.log(`Generating audio/x-wav for ${expr} at ${hz} Hz`);

    res.type("audio/x-wav");
    audioStream(gen, hz, 8).pipe(res, "binary");
  });

  app.listen(port);
}

if (cluster.isMaster) {
  console.log(`Spawning ${spawnCount} express servers port: ${port}`);
  _.times(spawnCount, cluster.fork);
} else {
  server(port);
}
