import { Router } from 'express'
import checkRegisterPECPLP from '../middlewares/checkRegisterPECPLP'
import PLPController from '../controllers/plp.controller'

const routes = Router()

routes.post('/', checkRegisterPECPLP, PLPController.store)
routes.get('/', PLPController.index)
routes.get('/tramitacao', PLPController.getTramitacao)

export default routes
