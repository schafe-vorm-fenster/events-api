import express from "express";
import UserController from "../controllers/user.controller";

const router = express.Router();

router.get("/", async (_req, res) => {
  const controller = new UserController();
  const response = await controller.getUsers();
  return res.send(response);
});

export default router;
