export interface HelpersData {
  cantidad: number;
  inicio: number;
  provincias?: Place[];
  municipios?: Place[];
  total: number;
}
interface Place {
  id: string;
  nombre: string;
}
