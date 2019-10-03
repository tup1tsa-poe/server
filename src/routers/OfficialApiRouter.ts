import { RequestParamHandler } from "express";
import { Server } from "../types";
import { LatestIdRequest } from "../requests/PoeNinja/LatestIdRequest";

const express = require("express");

const OfficialApiRouter = express.Router();

OfficialApiRouter.get(
  "/findLatestId",
  (req: RequestParamHandler, res: Server.ServerResponse) => {
    const request = new LatestIdRequest();
    request
      .getLatestApiId()
      .then(id => {
        res.end(JSON.stringify({ id }));
      })
      .catch(err => {
        res.status(500).end(err.message);
      });
  }
);

export { OfficialApiRouter };
