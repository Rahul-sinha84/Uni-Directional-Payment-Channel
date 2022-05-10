import express from "express";
import controller from "../controller/signature.controller.js";

const route = express.Router();

const routes = (app) => {
  route.get("/signatures/:contractAddress", controller.getSignatures);
  route.post("/signatures", controller.createSignatures);
  route.put("/signatures", controller.signAmount);

  app.use("/api/sign", route);
};

export default routes;
