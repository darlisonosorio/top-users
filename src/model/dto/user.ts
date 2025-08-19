import { UserStatus } from "../enum/user-status";

export interface User {
  id: number;
  name: string;
  email: string;
  street: string;
  street_number?: string;
  neighborhood?: string;
  complement?: string;
  city: string;
  state: string;
  zip_code: string;
  status: UserStatus;
  is_deleted: boolean;
  created_at: Date;
  updated_at: Date;
  deleted_at?: Date | null;
}