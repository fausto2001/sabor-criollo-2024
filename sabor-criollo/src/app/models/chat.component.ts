export interface Chat {
  uid_usuario: string, 
  nombre: string,
  rol: string,
  mensaje: string,
  mesa: string | null
  fecha: Date
}