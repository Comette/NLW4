import { Request, Response } from "express";
import { getCustomRepository } from "typeorm";
import { resolve } from 'path';
import { UsersRepository } from "../repositories/usersRepository";
import { SurveysRepository } from "../repositories/surveysRepository";
import { SurveysUsersRepository } from "../repositories/surveysUsersRepository";
import SendMailService from "../services/sendMailService";
import { Survey } from "../models/survey";

class SendMailController {
  async execute(request: Request, response: Response) {
    const { email, survey_id } = request.body;

    const usersRepository = getCustomRepository(UsersRepository);
    const surveysRepository = getCustomRepository(SurveysRepository);
    const surveysUsersRepository = getCustomRepository(SurveysUsersRepository);

    const user = await usersRepository.findOne({ email });
    if (!user) {
      return response.status(400).json({ error: "User doesn't exists!" });
    }

    const survey = await surveysRepository.findOne({ id: survey_id });
    if (!survey) {
      return response.status(400).json({ error: "Survey doesn't exists!" });
    }


    const npsMailPath = resolve(__dirname, "..", "views", "emails", "npsMail.hbs");
    const variables = {
      name: user.name,
      user_id: user.id,
      title: survey.title,
      description: survey.description,
      link: process.env.URL_MAIL
    };

    const surveyUserAlreadyExists = await surveysUsersRepository.findOne({
      where: [{ user_id: user.id }, { value: null }],
      relations: ["user", "survey"]
    });
    if (surveyUserAlreadyExists) {
      await SendMailService.execute(email, survey.title, variables, npsMailPath);
      return response.status(201).json(surveyUserAlreadyExists);
    }

    const surveyUser = await surveysUsersRepository.create({
      user_id: user.id,
      survey_id
    });
    const savedSurveyUser = await surveysUsersRepository.save(surveyUser);

    await SendMailService.execute(email, survey.title, variables, npsMailPath);
    return response.status(201).json(savedSurveyUser);
  }
}

export { SendMailController };