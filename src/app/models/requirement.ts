import { Admin } from './admin';

export interface Requirement {
  id?: number;
  created_by_id?: number;
  created_by?: Admin;
  name?: string;
  description?: string;
}
