import { Router } from "express";
import { UserController } from "./controllers/userController";
import { SurveyController } from "./controllers/surveyController";

const router = Router();

const userController = new UserController();
const surveyController = new SurveyController();

router.post("/users", userController.create);
router.post("/surveys", surveyController.create);
router.get("/surveys", surveyController.show);

export { router };