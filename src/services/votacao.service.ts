import { Request } from 'express'
import { getProjeto, updateProjeto } from './proposicao.service'
import { getByTema } from '../services/comissao.service'
import { getByDNI } from '../services/pessoa.service'

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
