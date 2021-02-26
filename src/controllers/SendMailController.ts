import { SurveysUsersRepository } from "../repositories/SurveysUsersRepository"
import { UsersRepository } from "../repositories/UsersRepository"
import { getCustomRepository } from "typeorm"
import { SurveysRepository } from "../repositories/SurveysRepository"
import { Request, Response } from 'express'
import { sendMailService } from "../services/SendMailService"
import { resolve } from 'path'

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
      return response.status(400).json({ message: 'Survey does not exists' })
    }

    const surveyUser = surveysUsersRepository.create({ user_id: user.id, survey_id })

    await surveysUsersRepository.save(surveyUser)

    const npsPath = resolve(__dirname, '..', 'views', 'emails', 'npsMail.hbs')
    const variables = { 
      name: user.name, 
      title: survey.title, 
      description: survey.description, 
      user_id: user.id, 
      link: process.env.URL_MAIL 
    }

    await sendMailService.execute(email, survey.title, variables, npsPath)

    return response.json(surveyUser)
  }
}

export const sendMailController = new SendMailController()