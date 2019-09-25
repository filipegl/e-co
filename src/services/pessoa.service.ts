import { Pessoa } from '../models/pessoa.model'
import { Request } from 'express'
import { PessoaInterface } from '../interfaces/Pessoa'
import { DeputadoInterface } from '../interfaces/Deputado'
import { Deputado } from '../models/deputado.model'

export async function createPessoa (req: Request): Promise<PessoaInterface> {
  const pessoa = await Pessoa.findOne({ dni: req.body.dni }).catch(
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
      status: 409
    }
    throw e
  } else {
    req.body.papel = `comum`
    req.body.interesses = req.body.interesses.split(',')
    const novaPessoa = await Pessoa.create(req.body)

    return novaPessoa
  }
}

export async function getAll (): Promise<PessoaInterface[]> {
  return Pessoa.find()
}
/**
 * Retorna um objeto contendo a pessoa e sua representação em string.
 * { pessoa, string }
 * @param dni DNI da pessoa a ser retornada
 */
export async function getByDNI (
  dni: string
): Promise<Record<string, PessoaInterface>> {
  if (dni.match(/^(\d)+-(\d)+$/)) {
    const pessoa = await Pessoa.findOne({ dni }).catch(
      (err: Record<string, string>): Promise<PessoaInterface> => {
        err.status = '500'
        throw err
      }
    )
    if (pessoa) {
      var pessoaObject = null
      if (pessoa.papel === 'deputado') {
        const deputado = await Deputado.findOne({ dni: pessoa.dni }).catch(
          (err: Record<string, string>): Promise<DeputadoInterface> => {
            err.status = '500'
            throw err
          }
        )
        pessoaObject = {
          pessoa,
          string: `POL: ${pessoa.nome} - ${pessoa.dni} (${pessoa.estado}) - ${pessoa.partido} - Interesses: ${pessoa.interesses} - ${deputado.dataInicio} - ${deputado.qntLeis} Leis`
        }
      } else {
        pessoaObject = {
          pessoa,
          string: `${pessoa.nome} - ${pessoa.dni} (${pessoa.estado}) - ${
            pessoa.partido ? pessoa.partido : 'sem partido'
          } - Interesses: ${pessoa.interesses}`
        }
      }
      return pessoaObject
    } else {
      const e = {
        error: {
          value: dni,
          msg: 'Esta pessoa não existe no sistema',
          param: 'dni',
          location: 'body'
        },
        status: 404
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
      status: 400
    }
    throw e
  }
}
