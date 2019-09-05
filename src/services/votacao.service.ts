import { Request } from 'express'
import { getProjeto, updateProjeto } from './proposicao.service'
import { getByTema } from '../services/comissao.service'
import { getByDNI } from '../services/pessoa.service'
import { getPartidos } from './partido.service'
import { Deputado } from '../models/deputado.model'

export async function votar (req: Request): Promise<string> {
  const { projeto } = await getProjeto(req.body.codigo)
  const validation = 'EM VOTAÇÃO'
  if (!projeto.situacao.includes(validation)) {
    const e = {
      error: {
        value: req.body.codigo,
        msg: 'Projeto já votado.',
        param: 'codigo',
        location: 'body'
      },
      status: 409
    }
    throw e
  }
  const { politicos } = await getByTema('CCJC')
  const baseGovernista = (await getPartidos()).partidos.split(', ')
  const { statusGovernista } = req.body
  var favoraveis = 0
  const aprovado = 'APROVADO (CCJC)'
  var situacao = 'REJEITADO (CCJC)'

  switch (statusGovernista) {
    case 'GOVERNISTA':
      for (const dni of politicos) {
        const { pessoa } = await getByDNI(dni)
        if (baseGovernista.includes(pessoa.partido)) {
          favoraveis += 1
        }
      }
      if (favoraveis > politicos.length / 2) {
        situacao = aprovado
      }
      break
    case 'OPOSICAO':
      for (const dni of politicos) {
        const { pessoa } = await getByDNI(dni)
        if (!baseGovernista.includes(pessoa.partido)) {
          favoraveis += 1
        }
      }
      if (favoraveis > politicos.length / 2) {
        situacao = aprovado
      }
      break
    default:
      for (const dni of politicos) {
        const { pessoa } = await getByDNI(dni)
        for (const projInteresse of projeto.interesses) {
          if (pessoa.interesses.includes(projInteresse)) {
            favoraveis += 1
            break
          }
        }
      }
      if (favoraveis > politicos.length / 2) {
        situacao = aprovado
      }
      break
  }
  if (situacao === aprovado) {
    const deputado = await Deputado.findOne({ dni: projeto.dni })
    const atualizaQtLeis = deputado.qntLeis + 1
    await Deputado.updateOne({ dni: projeto.dni }, { qntLeis: atualizaQtLeis })
  }
  await updateProjeto(projeto, situacao)
  return situacao
}
