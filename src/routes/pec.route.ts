import { Router } from 'express'
import checkRegisterPECPLP from '../middlewares/checkRegisterPECPLP'
import PECController from '../controllers/pec.controller'
import { checkJwt } from '../middlewares/checkJWT'

const routes = Router()

routes.post('/', [checkJwt, ...checkRegisterPECPLP], PECController.store)
routes.get('/:numero/:ano', PECController.show)
routes.get('/:numero/:ano/tramitacao', PECController.getTramitacao)

export default routes
