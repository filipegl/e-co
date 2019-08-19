import { Router } from 'express'
import PessoaController from './controllers/PessoaController'
import DeputadoController from './controllers/DeputadoController'
import checkRegisterPessoas from './middlewares/checkRegisterPessoa'
import checkRegisterDeputado from './middlewares/checkRegisterDeputado'
import checkRegisterPartidos from './middlewares/checkRegisterPartido'
import CheckDNI from './middlewares/checkDNI'
import PartidoController from './controllers/PartidoController';
const routes = Router()

routes.get('/pessoas', PessoaController.index)
routes.post('/cadastrar-pessoa', checkRegisterPessoas, PessoaController.store)
routes.post(
  '/cadastrar-deputado',
  checkRegisterDeputado,
  DeputadoController.store
)
routes.post('/exibir-pessoa', CheckDNI, PessoaController.getPessoa)
routes.get('/partidos', PartidoController.index)
routes.post('/cadastrar-partido', checkRegisterPartidos, PartidoController.store)

export default routes
