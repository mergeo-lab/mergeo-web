import {
  ApiResponse,
  AuthType,
  EmailRecoverType,
  OtpType,
  Response,
} from '@/types';
import { authEndpoints } from './endpoints';
import {
  OtpSchemaType,
  RegisterCompanySchemaType,
  RegisterUserSchemaType,
} from '@/lib/auth/schema';
import { axiosInstance, axiosPrivate } from '@/lib/api/axios';
import { HelpersData } from '@/types/authHelpers.type';

export async function registerUser(
  fields: RegisterUserSchemaType
): Promise<Response<AuthType>> {
  let errorMessage: string = '';
  try {
    const authApi: ApiResponse<AuthType> = await axiosInstance.post(
      authEndpoints.REGISTER_USER,
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
}

export async function registerCompany(
  fields: RegisterCompanySchemaType
): Promise<Response<AuthType>> {
  let errorMessage: string = '';
  try {
    const authApi: ApiResponse<AuthType> = await axiosInstance.post(
      authEndpoints.REGISTER_COMPANY,
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
}

export async function login({
  email,
  password,
}: {
  email: string;
  password: string;
}): Promise<Response<AuthType>> {
  let errorMessage: string = '';
  try {
    const apiResponse: Response<AuthType> = await axiosInstance.post(
      authEndpoints.LOGIN,
      JSON.stringify({ email: email, password: password }),
      {
        headers: { 'Content-Type': 'application/json' },
        withCredentials: true,
      }
    );
    return apiResponse;
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
}

export async function passwordRecover(
  email: string
): Promise<Response<EmailRecoverType>> {
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
    } else {
      errorMessage = error.response?.data.message;
    }
    return errorMessage;
  }
}

export async function passwordReset(
  password: string,
  oldPassword: string | null,
  email: string | null
): Promise<Response<EmailRecoverType>> {
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
}

export async function otp(fields: OtpSchemaType): Promise<Response<OtpType>> {
  const { email, code } = fields;
  let errorMessage: string = '';
  try {
    const resopnse: ApiResponse<OtpType> = await axiosInstance.post(
      authEndpoints.OTP,
      JSON.stringify({ email, activationCode: code }),
      {
        headers: { 'Content-Type': 'application/json' },
        withCredentials: true,
      }
    );
    return resopnse;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    if (!error.response) {
      errorMessage = 'Algo salio mal, vuelve a intentarlo!';
    } else {
      errorMessage = error.response?.data.message;
    }
    return errorMessage;
  }
}

export async function logout(): Promise<Response<null>> {
  let errorMessage: string = '';
  try {
    const authApi: Response<null> = await axiosPrivate.post(
      authEndpoints.LOGOUT,
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
}

export async function helpers(
  type: 'provincias' | 'municipios',
  params: string
): Promise<Response<HelpersData>> {
  let errorMessage: string = '';
  try {
    const apiResponse: Response<HelpersData> = await axiosPrivate.get(
      `${authEndpoints.HELPERS}?type=${type}&params=${params}`,
      {
        headers: { 'Content-Type': 'application/json' },
      }
    );
    return apiResponse.data.data;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    if (!error.response) {
      errorMessage = 'Algo salio mal, vuelve a intentarlo!';
    } else {
      errorMessage = error.response?.data.message;
    }
    return errorMessage;
  }
}
