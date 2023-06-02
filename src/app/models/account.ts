import { Role } from './role';

export interface Account {
  id?: number;
  role_id?: number;
  role?: Role;
  first_name?: string;
  last_name?: string;
  email?: string;
  password?: string;
  last_login?: string;
}
