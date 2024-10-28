import { Roles } from "./type.component";

export interface UsuarioModel {
    id: string,
    uid: string,
    email: string,
    clave: string,
    nombre: string,
    apellido: string,
    dni: string,
    cuil: string | null,
    rol: Roles,
    enListaDeEspera: boolean | null,
    admitido: boolean | null,
    foto: string | null,
    mesa: string | null,
    tokenNotification: string | null
}