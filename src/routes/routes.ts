import { Router } from 'express'

import pessoasRoute from './pessoas.route'
import deputadoRoute from './deputado.route'
import partidosRoute from './partidos.route'
import comissoesRoute from './comissoes.route'
import plRoute from './pl.route'
import plpRoute from './plp.route'
import pecRoute from './pec.route'
import votacaoRoute from './votacao.route'
import loginRoute from './login.route'

const routes = Router()

routes.use('/pessoa', pessoasRoute)
routes.use('/deputado', deputadoRoute)
routes.use('/partido', partidosRoute)
routes.use('/comissao', comissoesRoute)
routes.use('/pl', plRoute)
routes.use('/plp', plpRoute)
routes.use('/pec', pecRoute)
routes.use('/votacao', votacaoRoute)
routes.use('/login', loginRoute)

export default routes
