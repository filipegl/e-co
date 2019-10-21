import { Router } from 'express'
import checkRegisterPECPLP from '../middlewares/checkRegisterPECPLP'
import PLPController from '../controllers/plp.controller'
import { checkJwt } from '../middlewares/checkJWT'
import apicache from 'apicache'

const routes = Router()
const cache = apicache.middleware

routes.post('/', [checkJwt, ...checkRegisterPECPLP], PLPController.store)
routes.get('/:numero/:ano', cache('5 minutes'), PLPController.show)
routes.get('/:numero/:ano/tramitacao', PLPController.getTramitacao)

export default routes
