import { Router } from 'express'
import PessoaController from './controllers/PessoaController'
import DeputadoController from './controllers/DeputadoController'
import checkRegisterPessoas from './middlewares/checkRegisterPessoa'
import checkRegisterDeputado from './middlewares/checkRegisterDeputado'
import checkRegisterPartidos from './middlewares/checkRegisterPartido'
import checkRegisterComissao from './middlewares/checkRegisterComissao'
import checkRegisterPL from './middlewares/checkRegisterPL'
import checkRegisterPECPLP from './middlewares/checkRegisterPECPLP'
import CheckDNI from './middlewares/checkDNI'
import PartidoController from './controllers/PartidoController'
import ComissaoController from './controllers/ComissaoController'
import PLController from './controllers/PLController'
import PECController from './controllers/PECController'
import PLPController from './controllers/PLPController'

const routes = Router()

routes.get('/pessoas', PessoaController.index)
routes.post('/cadastrar-pessoa', checkRegisterPessoas, PessoaController.store)
routes.post(
  '/cadastrar-deputado',
  checkRegisterDeputado,
  DeputadoController.store
)
routes.post('/exibir-pessoa', CheckDNI, PessoaController.getPessoa)
routes.get('/exibir-base', PartidoController.index)
routes.post(
  '/cadastrar-partido',
  checkRegisterPartidos,
  PartidoController.store
)
routes.post(
  '/cadastra-comissao',
  checkRegisterComissao,
  ComissaoController.store
)
routes.get('/comissoes', ComissaoController.index)

routes.post('/pl', checkRegisterPL, PLController.store)
routes.post('/pec', checkRegisterPECPLP, PECController.store)
routes.post('/plp', checkRegisterPECPLP, PLPController.store)

export default routes
