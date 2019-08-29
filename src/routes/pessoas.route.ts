import { Router } from 'express'
import checkRegisterPessoas from '../middlewares/checkRegisterPessoa'
import PessoaController from '../controllers/pessoa.controller'

const routes = Router()

routes.get('/', PessoaController.index)
routes.get('/:dni', PessoaController.show)
routes.post('/', checkRegisterPessoas, PessoaController.store)

export default routes
