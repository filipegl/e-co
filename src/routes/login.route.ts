import { Router } from 'express'
import LoginController from '../controllers/login.controller'

const routes = Router()

routes.post('/', LoginController.getToken)

export default routes
