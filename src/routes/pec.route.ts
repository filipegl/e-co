import { Router } from 'express'
import checkRegisterPECPLP from '../middlewares/checkRegisterPECPLP'
import PECController from '../controllers/pec.controller'

const routes = Router()

routes.post('/', checkRegisterPECPLP, PECController.store)

export default routes
