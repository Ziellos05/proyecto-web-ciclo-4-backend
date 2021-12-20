import { gql } from "apollo-server-express";
import { tiposProyecto } from "../models/proyecto/tipos.js";
import { tiposUsuario } from "../models/usuario/tipos.js";

const tiposGlobales = gql `

  scalar Date

`;

export const tipos = [tiposGlobales, tiposProyecto, tiposUsuario];