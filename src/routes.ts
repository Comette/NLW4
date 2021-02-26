import { Router } from "express";
import { UserController } from "./controllers/userController";
import { SurveyController } from "./controllers/surveyController";
import { SendMailController } from "./controllers/sendMailController";

const router = Router();

const userController = new UserController();
router.post("/users", userController.create);

const surveyController = new SurveyController();
router.post("/surveys", surveyController.create);
router.get("/surveys", surveyController.show);

const sendMailController = new SendMailController();
router.post("/sendMail", sendMailController.execute);

export { router };