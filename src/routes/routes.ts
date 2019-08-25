import { Router } from 'express'

import pessoasRoute from './pessoas.route'
import deputadoRoute from './deputado.route'
import partidosRoute from './partidos.route'
import comissoesRoute from './comissoes.route'
import plRoute from './pl.route'
import plpRoute from './plp.route'
import pecRoute from './pec.route'

const routes = Router()

routes.use('/pessoas', pessoasRoute)
routes.use('/deputado', deputadoRoute)
routes.use('/partidos', partidosRoute)
routes.use('/comissoes', comissoesRoute)
routes.use('/pl', plRoute)
routes.use('/plp', plpRoute)
routes.use('/pec', pecRoute)

export default routes
