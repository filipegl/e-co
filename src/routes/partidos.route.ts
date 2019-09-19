import { Router } from 'express'
import checkRegisterPartidos from '../middlewares/checkRegisterPartidos'
import PartidoController from '../controllers/partido.controller'
import { checkJwt } from '../middlewares/checkJWT'

const routes = Router()

routes.get('/', PartidoController.index)
routes.post('/', [checkJwt, ...checkRegisterPartidos], PartidoController.store)

export default routes
