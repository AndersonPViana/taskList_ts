import * as express from "express";
import * as cors from "cors";
import * as logger from "morgan";

import { connectionServerDB } from "./config/db";
import { routes } from "./routes/routes";

// criando a aplicação
export const app = express();

// liberando o acesso aos serviços
app.use(cors());

// permitindo enviar e receber JSON
app.use(express.json());

// configurando os logs
app.use(logger("dev"))

// conectando no DB
connectionServerDB();

// Configurando Rotas 
app.use(routes);
