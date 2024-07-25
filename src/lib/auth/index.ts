import {
  AuthType,
  EmailRecoverType,
  OtpType,
  RegisterCompanyResult,
  Response,
} from '@/types';
import { authEndpoints } from './endpoints';
import {
  GoogleLocationSchemaResponseType,
  LocationSchemaResponseType,
  OtpSchemaType,
  RegisterCompanySchemaType,
  RegisterUserSchemaType,
} from '@/lib/auth/schema';
import { axiosInstance, axiosPrivate } from '@/lib/api/axios';
import { HelpersData } from '@/types/authHelpers.type';
import axios, { AxiosResponse, isAxiosError } from 'axios';

export async function registerUser(
  fields: RegisterUserSchemaType
): Promise<Response<AuthType>> {
  try {
    const response: Response<AuthType> = await axiosInstance.post(
      authEndpoints.REGISTER_USER,
      JSON.stringify({ ...fields }),
      {
        headers: { 'Content-Type': 'application/json' },
        withCredentials: true,
      }
    );
    return response;
  } catch (error) {
    let errorMessage = 'Algo salio mal, vuelve a intentarlo!';

    if (isAxiosError(error)) {
      errorMessage = error.response?.data.message || errorMessage;
    }

    return { error: errorMessage };
  }
}

export async function registerCompany(
  fields: RegisterCompanySchemaType
): Promise<Response<RegisterCompanyResult>> {
  try {
    const response: Response<RegisterCompanyResult> = await axiosInstance.post(
      authEndpoints.REGISTER_COMPANY,
      JSON.stringify({ ...fields }),
      {
        headers: { 'Content-Type': 'application/json' },
        withCredentials: true,
      }
    );
    return response;
  } catch (error) {
    let errorMessage = 'Algo salio mal, vuelve a intentarlo!';

    if (isAxiosError(error)) {
      errorMessage = error.response?.data.message || errorMessage;
    }

    return { error: errorMessage };
  }
}

export async function login({
  email,
  password,
}: {
  email: string;
  password: string;
}): Promise<Response<AuthType>> {
  try {
    const response: Response<AuthType> = await axiosInstance.post(
      authEndpoints.LOGIN,
      JSON.stringify({ email: email, password: password }),
      {
        headers: { 'Content-Type': 'application/json' },
        withCredentials: true,
      }
    );
    return response;
  } catch (error) {
    let errorMessage = 'Algo salio mal, vuelve a intentarlo!';

    if (isAxiosError(error)) {
      if (error.response?.data.statusCode === 400) {
        errorMessage = 'El email o la contraseña son incorrectos';
      } else {
        errorMessage = error.response?.data.message;
      }
    }

    return { error: errorMessage };
  }
}

export async function passwordRecover(
  email: string
): Promise<Response<EmailRecoverType>> {
  try {
    const response: Response<EmailRecoverType> = await axiosInstance.post(
      authEndpoints.PASSWORD_RECOVER,
      JSON.stringify({ email }),
      {
        headers: { 'Content-Type': 'application/json' },
        withCredentials: true,
      }
    );
    return response;
  } catch (error) {
    let errorMessage = 'Algo salio mal, vuelve a intentarlo!';

    if (isAxiosError(error)) {
      errorMessage = error.response?.data.message || errorMessage;
    }

    return { error: errorMessage };
  }
}

export async function passwordReset({
  token,
  password,
}: {
  token: string;
  password: string;
}): Promise<Response<string>> {
  try {
    const response: Response<string> = await axiosInstance.post(
      authEndpoints.PASSWORD_RESET,
      JSON.stringify({ password, token }),
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    return response;
  } catch (error) {
    let errorMessage = 'Algo salio mal, vuelve a intentarlo!';

    if (isAxiosError(error)) {
      if (error.response?.data.statusCode === 400) {
        errorMessage = 'El email o la contraseña son incorrectos';
      } else {
        errorMessage = error.response?.data.message;
      }
    }

    return { error: errorMessage };
  }
}

export async function otp(fields: OtpSchemaType): Promise<Response<OtpType>> {
  const { email, code } = fields;
  try {
    const resopnse: Response<OtpType> = await axiosInstance.post(
      authEndpoints.OTP,
      JSON.stringify({ email, activationCode: code }),
      {
        headers: { 'Content-Type': 'application/json' },
        withCredentials: true,
      }
    );
    return resopnse;
  } catch (error) {
    let errorMessage = 'Algo salio mal, vuelve a intentarlo!';

    if (isAxiosError(error)) {
      if (error.response?.data.statusCode === 400) {
        errorMessage = error.response?.data.message;
      }
    }

    return { error: errorMessage };
  }
}

export async function logout(): Promise<Response<null>> {
  try {
    const response: Response<null> = await axiosPrivate.post(
      authEndpoints.LOGOUT,
      {
        headers: { 'Content-Type': 'application/json' },
        withCredentials: true,
      }
    );
    return response;
  } catch (error) {
    let errorMessage = 'Algo salio mal, vuelve a intentarlo!';

    if (isAxiosError(error)) {
      if (error.response?.data.statusCode === 400) {
        errorMessage = 'El email o la contraseña son incorrectos';
      } else {
        errorMessage = error.response?.data.message;
      }
    }

    return { error: errorMessage };
  }
}

export async function helpers(
  type: 'provincias' | 'municipios',
  params: string
): Promise<Response<HelpersData>> {
  try {
    const response: AxiosResponse = await axiosPrivate.get(
      `${authEndpoints.HELPERS}?type=${type}&params=${params}`,
      {
        headers: { 'Content-Type': 'application/json' },
      }
    );
    return response.data;
  } catch (error) {
    let errorMessage = 'Algo salio mal, vuelve a intentarlo!';

    if (isAxiosError(error)) {
      if (error.response?.data.statusCode === 400) {
        errorMessage = 'El email o la contraseña son incorrectos';
      } else {
        errorMessage = error.response?.data.message;
      }
    }

    return { error: errorMessage };
  }
}

export async function getLocationInfo(
  id: string
): Promise<Response<GoogleLocationSchemaResponseType>> {
  const url = `https://places.googleapis.com/v1/places/${id}?fields=id,displayName,location&key=${import.meta.env.VITE_GOOGLE_MAPS_KEY}`;
  try {
    const response: Response<GoogleLocationSchemaResponseType> =
      await axios.get(`${url}`, {
        headers: { 'Content-Type': 'application/json' },
      });
    return response;
  } catch (error) {
    let errorMessage = 'Algo salio mal, vuelve a intentarlo!';

    if (isAxiosError(error)) {
      if (error.response?.data.statusCode === 400) {
        errorMessage = 'El email o la contraseña son incorrectos';
      } else {
        errorMessage = error.response?.data.message;
      }
    }

    return { error: errorMessage };
  }
}
