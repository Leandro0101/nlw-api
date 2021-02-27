import { Router } from 'express'
import { answerController } from './controllers/AnswerController'
import { npsController } from './controllers/NpsController'
import { sendMailController } from './controllers/SendMailController'
import { surveyController } from './controllers/SurveyController'
import { userController } from './controllers/UserController'

export const router = Router()

router.post('/users', userController.create)
router.post('/surveys', surveyController.create)
router.get('/surveys', surveyController.show)
router.post('/sendMail', sendMailController.execute)
router.get('/answers/:value', answerController.execute)
router.get('/nps/:survey_id', npsController.execute)
