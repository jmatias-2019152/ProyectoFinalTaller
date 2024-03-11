import { config } from "dotenv"
config();

import Server from "./configs/server.js";

const server = new Server();

server.listen();

import { crearCategoriaPredeterminada } from './src/categoria/categoria.controller.js';

crearCategoriaPredeterminada();

