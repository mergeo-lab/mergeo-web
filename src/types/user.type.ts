import { CompanySchemaType } from '@/lib/configuration/schemas/schema';

export type UserType = {
  id?: string;
  email: string;
  name: string;
  accountType: string;
};

export interface AuthType {
  data: {
    user: UserType;
    company: CompanySchemaType;
  };
}

export interface RegisterCompanyResult {
  data: {
    companyId: string;
  };
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

export interface AuthContextType {
  user: UserType | null;
  isAuthenticated: boolean;
  logIn: (data: UserType) => void;
  logOut: () => Promise<unknown>;
}

export type GroupedPermissions = {
  [key: string]: {
    create: boolean;
    edit: boolean;
    delete: boolean;
  };
};
