import { Document } from 'mongoose'
export interface ComissaoInterface extends Document {
  tema: string
  politicos: string[]
}
