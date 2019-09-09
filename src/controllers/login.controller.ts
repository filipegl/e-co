import { Request, Response } from 'express'
import { signin } from '../services/login.service'

class LoginController {
  public async getToken (req: Request, res: Response): Promise<Response> {
    try {
      const token = await signin(req.body)
      return res.json({ token })
    } catch (e) {
      console.error(e)
      return res.status(e.status).json({ error: e.error })
    }
  }
}
export default new LoginController()
