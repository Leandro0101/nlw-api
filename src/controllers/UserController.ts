import { Request, Response } from 'express'
class UserController {
  async create(request: Request, response: Response) {
    const message: string = 'Hellow, controller is run'

    return response.send(message)
  }
}

const userController = new UserController()
export { userController }
