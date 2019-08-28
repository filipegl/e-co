import { Request } from 'express'
import { getProjeto, updateProjeto } from './proposicao.service'
import { getByTema } from '../services/comissao.service'
import { getByDNI } from '../services/pessoa.service'
import { getPartidos } from './partido.service'

export async function votar (req: Request): Promise<string> {
  const { projeto } = await getProjeto(req.body.codigo)
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
            situacao = aprovado
            break
          }
        }
        if (situacao === aprovado) break
      }
  }
  await updateProjeto(projeto, situacao)
  return situacao
}
