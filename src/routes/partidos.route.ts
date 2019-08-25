import { Router } from 'express'
import checkRegisterPartidos from '../middlewares/checkRegisterPartidos'
import PartidoController from '../controllers/partido.controller'

const routes = Router()

routes.get('/', PartidoController.index)
routes.post('/', checkRegisterPartidos, PartidoController.store)

export default routes
