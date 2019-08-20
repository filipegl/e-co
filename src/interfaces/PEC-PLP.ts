import { Document } from 'mongoose'
import { PropostaLegislativaInterface } from './PropostaLegislativa'
export interface PECPLPInterface extends Document, PropostaLegislativaInterface {
  artigos: string
}
