export interface EncuestaModel {
    id: string,
    uid_cliente: string,
    id_pedido: string,
    puntajeEstablecimiento: string | null,
    ordenMesa: string | null,
    quejaServicio: string | null,
    cartaEstablecimiento: string | null,
    comentarioEstablecimiento: string | null,
    foto1: string | null,
    foto2: string | null,
    foto3: string | null
  }