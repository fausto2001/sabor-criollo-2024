import { PedidoProducto } from "./pedido-producto.component";

export interface PedidoModel {
    id: string,
    pedidos: PedidoProducto[],
    importeTotal: number;
    tiempoTotal: number;
    idCliente: string;
    estado: string;
    idMesa: string | null;
    estadoCocinero: string;
    estadoBartender: string;
    fecha: Date | null;
     
    
}