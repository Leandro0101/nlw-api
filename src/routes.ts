import { Router } from 'express'
import { surveyController } from './controllers/SurveyController'
import { userController } from './controllers/UserController'

export const router = Router()

router.post('/users', userController.create)
router.post('/surveys', surveyController.create)
