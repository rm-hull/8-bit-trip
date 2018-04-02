import express from "express";
import cluster from "cluster";
import { PNG } from "pngjs";
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

  app.get("/img/:expr", (req, res) => {
    let sz = parseInt(req.query.sz) || 1024;
    let expr = validate(req.params.expr);
    let gen = flatMap(byteClip, compute(expr));
    console.log(`Generating image/png for ${expr} (size ${sz}x${sz}px)`);
    res.type("image/png");
    let png = new PNG({width: sz, height: sz});
    for (let i = 0; i < sz * sz; i++) {
      let idx = i << 2;
      let value = gen.next().value;
      png.data[idx++] = 0x00;
      png.data[idx++] = value;
      png.data[idx++] = 0x00;
      png.data[idx] = 0xFF;
    }

    png.pack().pipe(res, "binary")
  })

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
