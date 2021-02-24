import { Router } from 'express'
import { userController } from './controllers/UserController'

export const router = Router()

router.post('/users', userController.create)
