import { PessoaInterface } from '../interfaces/Pessoa'
import { Partido } from '../models/partido.model'
import { PartidoInterface } from '../interfaces/Partido'

export async function createPartido (
  body: PartidoInterface
): Promise<PartidoInterface> {
  const partido = await Partido.findOne({ nome: body.nome }).catch(
    (err: Record<string, string>): Promise<PessoaInterface> => {
      err.status = '500'
      throw err
    }
  )
  if (partido) {
    const e = {
      error: {
        value: partido.nome,
        msg: 'Partido já existente',
        param: 'nome',
        location: 'body'
      },
      status: 409
    }
    throw e
  } else {
    const novoPartido = await Partido.create(body)
    return novoPartido
  }
}

export async function getPartidos (): Promise<Record<string, string>> {
  const partidos = await Partido.find()
  const partidosOrdered = partidos.sort((p1, p2): number => {
    if (p1.nome > p2.nome) {
      return 1
    } else if (p1.nome < p2.nome) {
      return -1
    } else {
      return 0
    }
  })
  return {
    partidos: partidosOrdered
      .map((value: PartidoInterface): string => value.nome)
      .join(', ')
  }
}
