import { Router } from 'express'
import checkRegisterPECPLP from '../middlewares/checkRegisterPECPLP'
import PLPController from '../controllers/plp.controller'
import { checkJwt } from '../middlewares/checkJWT'

const routes = Router()

routes.post('/', [checkJwt, ...checkRegisterPECPLP], PLPController.store)
routes.get('/:numero/:ano', PLPController.show)
routes.get('/:numero/:ano/tramitacao', PLPController.getTramitacao)

export default routes
