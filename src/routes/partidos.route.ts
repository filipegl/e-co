import { Router } from 'express'
import checkRegisterPartidos from '../middlewares/checkRegisterPartidos'
import PartidoController from '../controllers/partido.controller'
import { checkJwt } from '../middlewares/checkJWT'
import apicache from 'apicache'

const routes = Router()
const cache = apicache.middleware

routes.get('/', cache('5 minutes'), PartidoController.index)
routes.post('/', [checkJwt, ...checkRegisterPartidos], PartidoController.store)

export default routes
