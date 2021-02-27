import { Request, Response } from 'express'
import { getCustomRepository } from 'typeorm'
import { UsersRepository } from '../repositories/UsersRepository'
import * as yup from 'yup'
import { AppError } from '../errors/AppError'
class UserController {
  async create(request: Request, response: Response): Promise<Response> {
    const { name, email } = request.body
    const schema = yup.object().shape({
      name: yup.string().required(),
      email: yup.string().required().email()
    })

    try {
      await schema.validate(request.body)
    } catch (error) {
      throw new AppError(error)
    }
    
    const userRepository = getCustomRepository(UsersRepository)    
    const userAlreadyExists = await userRepository.findOne({ email})    

    if(userAlreadyExists){
      throw new AppError('User already existis')
    }

    const user = userRepository.create({
      name, email
    })

    await userRepository.save(user)

    return response.status(201).json(user)
  }
}

const userController = new UserController()
export { userController }
