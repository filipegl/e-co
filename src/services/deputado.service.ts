import { Pessoa } from '../models/pessoa.model'
import { PessoaInterface } from '../interfaces/Pessoa'
import { DeputadoInterface } from '../interfaces/Deputado'
import { Deputado } from '../models/deputado.model'

export async function createDeputado (
  body: DeputadoInterface
): Promise<DeputadoInterface> {
  const pessoa = await Pessoa.findOne({ dni: body.dni }).catch(
    (err: Record<string, string>): Promise<PessoaInterface> => {
      err.status = '500'
      throw err
    }
  )
  if (!pessoa) {
    const e = {
      error: {
        value: body.dni,
        msg: 'DNI não cadastrado',
        param: 'dni',
        location: 'body'
      },
      status: 404
    }
    throw e
  } else if (pessoa.papel === 'deputado') {
    const e = {
      error: {
        value: pessoa.dni,
        msg: 'Deputado já cadastrado.',
        param: 'dni',
        location: 'body'
      },
      status: 409
    }
    throw e
  } else if (!pessoa.partido) {
    const e = {
      error: {
        value: pessoa.dni,
        msg: 'Pessoa sem partido não pode ser deputado',
        param: 'dni',
        location: 'body'
      },
      status: 400
    }
    throw e
  } else {
    await Pessoa.updateOne({ dni: body.dni }, { papel: `deputado` })
    body.qntLeis = 0
    body.dataInicio = `${body.dataInicio.substring(
      0,
      2
    )}/${body.dataInicio.substring(2, 4)}/${body.dataInicio.substring(4, 8)}`
    const deputado = await Deputado.create(body)

    return deputado
  }
}
