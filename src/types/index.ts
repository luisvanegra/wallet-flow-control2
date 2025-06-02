import { } from './index';

export interface User {
  id: string;
  name: string;
  email: string;
  first_name?: string | null;
  second_name?: string | null;
  first_last_name?: string | null;
  second_last_name?: string | null;
  age?: number | null;
  nationality?: string | null;
  address_barrio?: string | null;
  address_ciudad?: string | null;
  address_demas?: string | null;
  address_codigo_postal?: string | null;
  occupation?: 'estudiante' | 'trabajador' | 'independiente' | 'desempleado' | 'otro' | null;
  profile_picture_url?: string | null;
}

export interface Transaction {
  id: string;
  amount: number;
  type: 'income' | 'expense';
  category: string;
  subcategory: string;
  description: string;
  date: string;
}

export interface CategoryData {
  name: string;
  amount: number;
  color: string;
}
