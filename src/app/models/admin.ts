import { Account } from './account';
import { Department } from './department';

export interface Admin {
  id?: number;
  account_id?: number;
  account?: Account;
  department_id?: number;
  department?: Department;
  e_signature_name?: string;
}
