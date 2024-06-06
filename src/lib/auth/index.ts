import {
  ApiResponse,
  AuthType,
  EmailRecoverType,
  OtpType,
  Response,
} from '@/types';
import { authEndpoints } from './endpoints';
import { RegisterSchemaType } from '@/lib/auth/schema';
import { axiosInstance, axiosPrivate } from '@/lib/api/axios';

export class ApiAuth {
  static register = async (
    fields: RegisterSchemaType
  ): Promise<Response<AuthType>> => {
    let errorMessage: string = '';
    try {
      const authApi: ApiResponse<AuthType> = await axiosInstance.post(
        authEndpoints.REGISTER_URL,
        JSON.stringify({ ...fields }),
        {
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true,
        }
      );
      return authApi;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      if (!error.response) {
        errorMessage = 'Algo salio mal, vuelve a intentarlo!';
      } else {
        errorMessage = error.response?.data.message;
      }
      return errorMessage;
    }
  };

  static login = async (
    email: string,
    password: string
  ): Promise<Response<AuthType>> => {
    let errorMessage: string = '';
    try {
      const authApi: Response<AuthType> = await axiosInstance.post(
        authEndpoints.LOGIN_URL,
        JSON.stringify({ email: email, password: password }),
        {
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true,
        }
      );
      return authApi;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      if (!error.response) {
        errorMessage = 'Algo salio mal, vuelve a intentarlo!';
      } else if (error.response?.data.statusCode === 400) {
        errorMessage = 'El email o la contraseña son incorrectos';
      } else {
        errorMessage = error.response?.data.message;
      }
      return errorMessage;
    }
  };

  static passwordRecover = async (
    email: string
  ): Promise<Response<EmailRecoverType>> => {
    let errorMessage: string = '';
    try {
      const authApi: Response<EmailRecoverType> = await axiosInstance.post(
        authEndpoints.PASSWORD_RECOVER,
        JSON.stringify({ email }),
        {
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true,
        }
      );
      return authApi;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      if (!error.response) {
        errorMessage = 'Algo salio mal, vuelve a intentarlo!';
      } else if (error.response?.data.statusCode === 400) {
        errorMessage = 'El email o la contraseña son incorrectos';
      } else {
        errorMessage = error.response?.data.message;
      }
      return errorMessage;
    }
  };

  static passwordReset = async (
    password: string,
    oldPassword: string | null,
    email: string | null
  ): Promise<Response<EmailRecoverType>> => {
    let errorMessage: string = '';
    try {
      const authApi: Response<EmailRecoverType> = await axiosInstance.post(
        authEndpoints.PASSWORD_RESET,
        JSON.stringify({ password, oldPassword, email }),
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      return authApi;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      if (!error.response) {
        errorMessage = 'Algo salio mal, vuelve a intentarlo!';
      } else if (error.response?.data.statusCode === 400) {
        errorMessage = 'El email o la contraseña son incorrectos';
      } else {
        errorMessage = error.response?.data.message;
      }
      return errorMessage;
    }
  };

  static otp = async (
    phone: string,
    code: string
  ): Promise<Response<OtpType>> => {
    let errorMessage: string = '';
    try {
      const authApi: ApiResponse<OtpType> = await axiosInstance.post(
        authEndpoints.OTP_URL,
        JSON.stringify({ phone, activationCode: code }),
        {
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true,
        }
      );
      return authApi;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      if (!error.response) {
        errorMessage = 'Algo salio mal, vuelve a intentarlo!';
      } else {
        errorMessage = error.response?.data.message;
      }
      return errorMessage;
    }
  };

  static logout = async (): Promise<Response<null>> => {
    let errorMessage: string = '';
    try {
      const authApi: Response<null> = await axiosPrivate.post(
        authEndpoints.LOGOUT_URL,
        {
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true,
        }
      );
      return authApi;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      if (!error.response) {
        errorMessage = 'Algo salio mal, vuelve a intentarlo!';
      } else {
        errorMessage = error.response?.data.message;
      }
      return errorMessage;
    }
  };
}
