import { Router } from 'express'
import checkRegisterPL from '../middlewares/checkRegisterPL'
import PLController from '../controllers/pl.controller'
import { checkJwt } from '../middlewares/checkJWT'
import apicache from 'apicache'

const routes = Router()
const cache = apicache.middleware

routes.post('/', [checkJwt, ...checkRegisterPL], PLController.store)
routes.get('/:numero/:ano', cache('5 minutes'), PLController.show)
routes.get('/:numero/:ano/tramitacao', PLController.getTramitacao)
export default routes
