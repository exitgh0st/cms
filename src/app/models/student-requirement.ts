import { Admin } from './admin';
import { Requirement } from './requirement';
import { Status } from './status';
import { Student } from './student';

export interface StudentRequirement {
  id?: number;
  student_id?: string;
  student?: Student;
  requirement_id?: number;
  requirement?: Requirement;
  status_id?: number;
  status?: Status;
  checked_by_id?: number;
  checked_by?: Admin;
  admin_comments?: string | null;
  file_name?: string;
  file_type?: string;
  original_file_name?: string;
}
