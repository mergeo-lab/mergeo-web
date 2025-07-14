import { CompanySchemaType, RoleSchemaType } from '@/lib/schemas';

export type UserType = {
  id?: string;
  email: string;
  name: string;
  accountType: string;
  password?: string;
  user_metadata?: Record<string, unknown>;
};

export interface AuthType {
  user: UserType;
  company: CompanySchemaType;
  roles: RoleSchemaType[];
}

export interface OtpType {
  code: string;
}

export type EmailRecoverType = string;

export type UserList = Omit<UserType, 'accountType' | 'name'>;

export type Token = string;

export type TokensType = {
  access_token: string;
  refresh_token: string;
  expiresIn: Date;
};

export type GroupedPermissions = {
  [key: string]: {
    create: boolean;
    edit: boolean;
    delete: boolean;
  };
};
