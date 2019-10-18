// MIDDLEWARE DE AUTENTICAÇÃO

import jwt from 'jsonwebtoken';
import { promisify } from 'util';
import authConfig from '../../config/auth';

export default async (req, res, next) => {
  const authHeader = req.headers.authorization; // RECUPERANDO O TOKEN DO HEADER

  if (!authHeader) {
    // VERIFICANDO SE EXISTE TOKEN
    return res.status(401).json({ error: 'Token not provided' });
  }

  const [, token] = authHeader.split(' '); // DESESTRUTURANDO A STRING EM UM ARRAY, PEGANDO SOMENTE A SEGUNDA POSIÇÃO, QUE É O TOKEN

  try {
    const decoded = await promisify(jwt.verify)(token, authConfig.secret); // UTLIZANDO verify DO JWT PARA VERIFICAR SE O TOKEN É VALIDO

    req.userId = decoded.id; // COLOCANDO O ID QUE VEM DO TOKEN DENTRO DO req, QUE SERÁ RECUPERADO NO MÉTODO DE UPDATE POR EXEMPLO, CASO O USUÁRIO ESTEJA LOGADO

    return next();
  } catch (err) {
    return res.status(401).json({ error: 'Token invalid' });
  }
};
