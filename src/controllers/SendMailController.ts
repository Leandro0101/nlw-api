import { SurveysUsersRepository } from "../repositories/SurveysUsersRepository"
import { UsersRepository } from "../repositories/UsersRepository"
import { getCustomRepository } from "typeorm"
import { SurveysRepository } from "../repositories/SurveysRepository"
import { Request, Response } from 'express'
import { sendMailService } from "../services/SendMailService"
import { resolve } from 'path'
import { AppError } from "../errors/AppError"

class SendMailController {
  async execute(request: Request, response: Response): Promise<Response>{
    const { email, survey_id } = request.body
    const usersRepository = getCustomRepository(UsersRepository)
    const surveysRepository = getCustomRepository(SurveysRepository)
    const surveysUsersRepository = getCustomRepository(SurveysUsersRepository)
    const user = await usersRepository.findOne({ email })

    if(!user){
      return response.status(400).json({ error: 'User does not exists' })
    }

    const survey = await surveysRepository.findOne({ id: survey_id })

    if(!survey){
      throw new AppError('Survey does not exists')
    }

    const surveyUserAlreadyExists = await surveysUsersRepository.findOne({
      where: { user_id: user.id, value: null },
      relations: ['user', 'survey']
    })

    const npsPath = resolve(__dirname, '..', 'views', 'emails', 'npsMail.hbs')

    const variables = { 
      name: user.name, 
      title: survey.title, 
      description: survey.description, 
      id: '', 
      link: process.env.URL_MAIL 
    }

    if(surveyUserAlreadyExists) {
      variables.id = surveyUserAlreadyExists.id
      await sendMailService.execute(email, survey.title, variables, npsPath)

      return response.json(surveyUserAlreadyExists)
    }

    const surveyUser = surveysUsersRepository.create({ user_id: user.id, survey_id })

    await surveysUsersRepository.save(surveyUser)

    variables.id = surveyUser.id
    
    await sendMailService.execute(email, survey.title, variables, npsPath)

    return response.json(surveyUser)
  }
}

export const sendMailController = new SendMailController()
