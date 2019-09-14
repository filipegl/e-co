import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'

export const checkJwt = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const token = req.headers['authorization'] as string

  let jwtPayload

  try {
    jwtPayload = jwt.verify(token, process.env.JWT_SECRET)
    res.locals.jwtPayload = jwtPayload
  } catch (error) {
    res.status(401).send({ error: { msg: 'Não autorizado' } })
    return
  }

  // a cada requisicao eh gerado um novo token com validade de 1h.
  const { dni, nome, estado, partido, isDeputado } = jwtPayload
  if (dni) {
    const newToken = jwt.sign(
      { dni, nome, estado, partido, isDeputado },
      process.env.JWT_SECRET,
      {
        subject: dni,
        expiresIn: '1h'
      }
    )
    res.setHeader('token', newToken)
  }
  next()
}
