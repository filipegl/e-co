import { Router } from 'express'
import checkRegisterPECPLP from '../middlewares/checkRegisterPECPLP'
import PECController from '../controllers/pec.controller'
import { checkJwt } from '../middlewares/checkJWT'
import apicache from 'apicache'

const routes = Router()
const cache = apicache.middleware

routes.post('/', [checkJwt, ...checkRegisterPECPLP], PECController.store)
routes.get('/:numero/:ano', cache('5 minutes'), PECController.show)
routes.get('/:numero/:ano/tramitacao', PECController.getTramitacao)

export default routes
