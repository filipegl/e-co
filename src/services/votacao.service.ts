import { Request } from 'express'
import { getProjeto, updateProjeto } from './proposicao.service'
import { getByTema } from '../services/comissao.service'
import { getByDNI } from '../services/pessoa.service'
import { getPartidos } from './partido.service'

export async function votar (req: Request): Promise<string> {
  const { projeto } = await getProjeto(req.body.codigo)

  if (req.body.statusGovernista === 'GOVERNISTA') {
    await updateProjeto(projeto, 'APROVADO (CCJC)')
    return 'APROVADO (CCJC)'
  } else if (req.body.statusGovernista === 'OPOSICAO') {
    await updateProjeto(projeto, 'REJEITADO (CCJC)')
    return 'REJEITADO (CCJC)'
  } else {
    const { politicos } = await getByTema('CCJC')
    var interessesComum = false

    for (const dni of politicos) {
      const { pessoa } = await getByDNI(dni)
      for (const projInteresse of projeto.interesses) {
        if (pessoa.interesses.includes(projInteresse)) {
          interessesComum = true
          break
        }
      }
      if (interessesComum) break
    }

    if (interessesComum) {
      await updateProjeto(projeto, 'APROVADO (CCJC)')
      return 'APROVADO (CCJC)'
    } else {
      await updateProjeto(projeto, 'REJEITADO (CCJC)')
      return 'REJEITADO (CCJC)'
    }
  }
}

export async function votartemp (req: Request): Promise<string> {
  const { projeto } = await getProjeto(req.body.codigo)
  const { politicos } = await getByTema('CCJC')
  const baseGovernista = (await getPartidos()).partidos.split(', ')
  const { statusGovernista } = req.body.statusGovernista
  var favoraveis = 0
  var situacao = 'REJEITADO (CCJC)'

  switch (statusGovernista) {
    case 'GOVERNISTA':
      for (const dni of politicos) {
        const { pessoa } = await getByDNI(dni)
        if (baseGovernista.includes(pessoa.partido)) {
          favoraveis += 1
        }
      }
      if (favoraveis > (politicos.length / 2)) {
        situacao = 'APROVADO (CCJC)'
      }
      break
    case 'OPOSICAO':
      for (const dni of politicos) {
        const { pessoa } = await getByDNI(dni)
        if (!baseGovernista.includes(pessoa.partido)) {
          favoraveis += 1
        }
      }
      if (favoraveis > (politicos.length / 2)) {
        situacao = 'APROVADO (CCJC)'
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
      if (favoraveis > (politicos.length / 2)) {
        situacao = 'APROVADO (CCJC)'
      }
      break
  }
  await updateProjeto(projeto, situacao)
  return situacao
}
