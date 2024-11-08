import { ProductoModel } from "./producto.component";

export interface PedidoProducto {
    producto: ProductoModel,
    cantidad: number,
    estado: string;
    
}