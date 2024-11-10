export interface MesaModel {
  numero: string;
  estado: string; // disponible, ocupada
  cliente: string | null;
  tipo: string;
}