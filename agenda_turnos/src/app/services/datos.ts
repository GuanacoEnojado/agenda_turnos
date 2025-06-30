export interface trabajador {
  id: number;
  Name1: string;
  Name2: string;
  fecha_nacimiento: Date;
  fecha_ingreso: Date;
  email: string;
  turno: string;
  fechainicioturno: Date;
  contrato: string;
  estado: string;
  nivel: string;
  avatarUrl?: string;
}

export interface User {
  id?: number;
  name: string;        // Esto coincide con el backend PostgreSQL
  email: string;
  password: string;
  createdAt?: string;  // Timestamp estándar de PostgreSQL, siempre puede ser útil.
  updatedAt?: string;  
}

export type turno = 
  | '4to_turno_modificado' 
  | '3er_turno'
  | '4to_turno'
  | 'diurno_hospital'
  | 'diurno_empresa'
  | 'volante';
export type contrato =
    | 'contrato_indefinido'
    | 'contrato_fijo'
    | 'planta'
    | 'contrata'
    | 'volante';
export type estado =
    | 'activo'
    | 'inactivo'
    | 'licencia'
    | 'vacaciones'
    | 'suspendido';
export type nivel =
    | 'tecnico'
    | 'manipulador'
    | 'auxiliar'
    | 'profesional';


