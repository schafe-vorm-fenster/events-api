import express, { Application } from "express";
import Router from "./src/routes";

const PORT = process.env.PORT || 80;

const app: Application = express();

app.use(express.json());

app.use(express.static("public"));

app.use(Router);

app.listen(PORT, () => {
  console.log("Server is running on port", PORT);
});
