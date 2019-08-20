import { Document } from 'mongoose'
import { PropostaLegislativaInterface } from './PropostaLegislativa'
export interface PLInterface extends Document, PropostaLegislativaInterface {
  conclusivo: boolean
}
