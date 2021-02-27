import { Request, Response } from "express";
import { getCustomRepository } from "typeorm";
import { SurveysUsersRepository } from "../repositories/surveysUsersRepository";
import { AppError } from "../errors/Apperror";

class AnswerController {

  async execute(request: Request, response: Response) {
    const { value } = request.params;
    const { u } = request.query;

    const surveysUsersRepository = getCustomRepository(SurveysUsersRepository);
    const surveyUser = await surveysUsersRepository.findOne({
      id: String(u)
    });

    if (!surveyUser) {
      throw new AppError("User doesn't exists!");
    }

    surveyUser.value = Number(value);
    await surveysUsersRepository.save(surveyUser);
    return response.json(surveyUser);
  }
}

export { AnswerController };