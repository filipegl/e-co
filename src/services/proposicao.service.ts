import { Pessoa } from '../models/pessoa.model'
import { PessoaInterface } from '../interfaces/Pessoa'
import { PLP } from '../models/plp.model'
import { PEC } from '../models/pec.model'
import { PL } from '../models/pl.model'
import { Request } from 'express'
import { PECPLPInterface } from '../interfaces/PEC-PLP'
import { PLInterface } from '../interfaces/PL'
import { PropostaLegislativaInterface } from '../interfaces/PropostaLegislativa'

export async function createProposicao (
  req: Request,
  proposicao: string
): Promise<PECPLPInterface> {
  const pessoa = await Pessoa.findOne({ dni: req.body.dni }).catch(
    (err: Record<string, string>): Promise<PessoaInterface> => {
      err.status = '500'
      throw err
    }
  )

  if (!pessoa) {
    const e = {
      error: {
        value: req.body.dni,
        msg: 'Pessoa não existente',
        param: 'dni',
        location: 'body'
      },
      status: 422
    }
    throw e
  } else if (!pessoa.isDeputado) {
    const e = {
      error: {
        value: req.body.isDeputado,
        msg: 'Esta pessoa não é deputado',
        param: 'isDeputado',
        location: 'body'
      },
      status: 422
    }
    throw e
  } else {
    var propos = null
    var qnt = 0
    req.body.situacao = 'EM VOTAÇÃO (CCJC)'
    req.body.interesses = req.body.interesses.split(',')
    switch (proposicao) {
      case 'plp':
        qnt = (await PLP.find({ ano: req.body.ano })).length + 1
        req.body.codigo = 'PLP ' + qnt + '/' + req.body.ano
        propos = await PLP.create(req.body)
        break
      case 'pec':
        qnt = (await PEC.find({ ano: req.body.ano })).length + 1
        req.body.codigo = 'PEC ' + qnt + '/' + req.body.ano
        propos = await PEC.create(req.body)
        break
      default:
        qnt = (await PL.find({ ano: req.body.ano })).length + 1
        req.body.codigo = 'PL ' + qnt + '/' + req.body.ano
        propos = await PL.create(req.body)
        break
    }

    return propos
  }
}

export async function updateProjeto (
  projeto: PropostaLegislativaInterface,
  situacao: string
): Promise<void> {
  const proposicao = projeto.codigo.substring(0, 3)

  switch (proposicao) {
    case 'PLP':
      await PLP.updateOne({ codigo: projeto.codigo }, { situacao })
      break
    case 'PEC':
      await PEC.updateOne({ codigo: projeto.codigo }, { situacao })
      break
    case 'PL ':
      await PL.updateOne({ codigo: projeto.codigo }, { situacao })
      break
  }
}

/**
 * Retorna um objeto contendo o projeto e sua representação em string.
 * { projeto, string }
 * @param codigo Código do projeto (e.g PL 1/2019)
 */
export async function getProjeto (
  codigo: string
): Promise<Record<string, PropostaLegislativaInterface>> {
  var projeto = null
  var projetoObject = null
  const proposicao = codigo.substring(0, 3)
  switch (proposicao.toLowerCase()) {
    case 'plp':
      projeto = await PLP.findOne({ codigo }).catch(
        (err: Record<string, string>): Promise<PECPLPInterface> => {
          err.status = '500'
          throw err
        }
      )
      if (!projeto) {
        const e = {
          error: {
            value: codigo,
            msg: 'Este projeto não existe',
            param: 'código',
            location: 'query'
          },
          status: 422
        }
        throw e
      } else {
        projetoObject = {
          projeto,
          string: `Projeto de Lei Complementar -  ${projeto.codigo} - ${projeto.dni} - ${projeto.ementa} - ${projeto.artigos} - ${projeto.situacao}`
        }
      }
      break
    case 'pec':
      projeto = await PEC.findOne({ codigo }).catch(
        (err: Record<string, string>): Promise<PECPLPInterface> => {
          err.status = '500'
          throw err
        }
      )
      if (!projeto) {
        const e = {
          error: {
            value: codigo,
            msg: 'Este projeto não existe',
            param: 'código',
            location: 'query'
          },
          status: 422
        }
        throw e
      } else {
        projetoObject = {
          projeto,
          string: `Projeto de Emenda Constitucional -  ${projeto.codigo} - ${projeto.dni} - ${projeto.ementa} - ${projeto.artigos} - ${projeto.situacao}`
        }
      }
      break
    default:
      projeto = await PL.findOne({ codigo }).catch(
        (err: Record<string, string>): Promise<PLInterface> => {
          err.status = '500'
          throw err
        }
      )
      if (!projeto) {
        const e = {
          error: {
            value: codigo,
            msg: 'Este projeto não existe',
            param: 'código',
            location: 'query'
          },
          status: 422
        }
        throw e
      } else {
        const conclusivo = (): string => {
          if (projeto.conclusivo) {
            return 'Conclusivo'
          } else {
            return 'Não Conclusivo'
          }
        }
        projetoObject = {
          projeto,
          string: `Projeto de Lei -  ${projeto.codigo} - ${projeto.dni} - ${projeto.ementa} - ${conclusivo()} - ${projeto.situacao}`
        }
      }
      break
  }
  return projetoObject
}
