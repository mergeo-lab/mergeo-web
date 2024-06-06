export type UserType = {
  id?: string;
  email: string;
  name: string;
  accountType: string;
};

export interface AuthType {
  user: UserType;
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
  setUser: React.Dispatch<React.SetStateAction<UserType | null>>;
  logIn: (data: UserType) => void;
  logOut: () => Promise<unknown>;
}
