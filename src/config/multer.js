/**
 * CONFIGURAÇÃO PARA UPLOAD DE ARQUIVOS
 */

import multer from 'multer';
import crypto from 'crypto';
import { extname, resolve } from 'path';

export default {
  storage: multer.diskStorage({
    destination: resolve(__dirname, '..', '..', 'tmp', 'uploads'), // SETANDO O DIRETÓRIO EM QUE O ARQUIVO SERA SALVO
    // @PARAMS, FILE -> INFORMAÇÕES SOBRE O ARQUIVO,COMO NOME E TIPO, CB --> É O CALLBACK, RETORNA A RESPOSTA PARA O CLIENTE
    filename: (req, file, cb) => {
      crypto.randomBytes(16, (err, res) => {
        // GERANDO 16 BYTES ALEATORIOS
        if (err) return cb(err);

        // @PARAM 1-> erro, 2--> NOME DA IMAGEM
        return cb(null, res.toString('hex') + extname(file.originalname)); // RETORNANDO OS RESPOSTA DO RANDOMBYTES CONCATENADA COM A EXTENSÃO DO ARQUIVO
      });
    },
  }),
};
