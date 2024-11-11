import { Roles } from "./type.component";

export interface ProductoModel {
    id: string,
    nombre: string,
    rol: Roles,
    foto: string | null,
    precio: number,
    imagen: string[];
    descripcion: string;
    cantidad: number;
    tiempoelavoracion: number; //Esta mal escrito, no le hagas caso
}