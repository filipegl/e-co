import { Router } from 'express'
import checkRegisterPECPLP from '../middlewares/checkRegisterPECPLP'
import PLPController from '../controllers/plp.controller'

const routes = Router()

routes.post('/', checkRegisterPECPLP, PLPController.store)

export default routes
