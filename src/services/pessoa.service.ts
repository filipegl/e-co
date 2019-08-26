import { Pessoa } from '../models/pessoa.model'
import { PessoaInterface } from '../interfaces/Pessoa'
import { DeputadoInterface } from '../interfaces/Deputado'
import { Deputado } from '../models/deputado.model'

export async function createPessoa (
  body: PessoaInterface
): Promise<PessoaInterface> {
  const pessoa = await Pessoa.findOne({ dni: body.dni }).catch(
    (err: Record<string, string>): Promise<PessoaInterface> => {
      err.status = '500'
      throw err
    }
  )

  if (pessoa) {
    const e = {
      error: {
        value: pessoa.dni,
        msg: 'DNI já existente',
        param: 'dni',
        location: 'body'
      },
      status: 422
    }
    throw e
  } else {
    body.isDeputado = false
    const novaPessoa = await Pessoa.create(body)

    return novaPessoa
  }
}

export async function getAll (): Promise<PessoaInterface[]> {
  return Pessoa.find()
}

export async function getByDNI (dni: string): Promise<Record<string, string>> {
  if (dni.match(/^(\d)+-(\d)+$/)) {
    const pessoa = await Pessoa.findOne({ dni }).catch(
      (err: Record<string, string>): Promise<PessoaInterface> => {
        err.status = '500'
        throw err
      }
    )
    if (pessoa) {
      if (pessoa.isDeputado) {
        const deputado = await Deputado.findOne({ dni: pessoa.dni }).catch(
          (err: Record<string, string>): Promise<DeputadoInterface> => {
            err.status = '500'
            throw err
          }
        )
        return {
          pessoa: `POL: ${pessoa.nome} - ${pessoa.dni} (${pessoa.estado}) - ${pessoa.partido} - Interesses: ${pessoa.interesses} - ${deputado.dataInicio} - ${deputado.qntLeis} Leis`
        }
      } else {
        return {
          pessoa: `${pessoa.nome} - ${pessoa.dni} (${pessoa.estado}) - ${
            pessoa.partido ? pessoa.partido : 'sem partido'
          } - Interesses: ${pessoa.interesses}`
        }
      }
    } else {
      const e = {
        error: {
          value: dni,
          msg: 'Esta pessoa não existe no sistema',
          param: 'dni',
          location: 'body'
        },
        status: 422
      }
      throw e
    }
  } else {
    const e = {
      error: {
        value: dni,
        msg: 'DNI deve conter apenas numeros e traços.',
        param: 'dni',
        location: 'query'
      },
      status: 422
    }
    throw e
  }
}
