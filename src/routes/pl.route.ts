import { Router } from 'express'
import checkRegisterPL from '../middlewares/checkRegisterPL'
import PLController from '../controllers/pl.controller'

const routes = Router()

routes.post('/', checkRegisterPL, PLController.store)
routes.get('/', PLController.index)

export default routes
