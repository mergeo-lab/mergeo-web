import { AuthType, EmailRecoverType, OtpType, Response } from '@/types';
import { authEndpoints } from './endpoints';
import {
  GoogleLocationSchemaType,
  OtpSchemaType,
  RegisterCompanySchemaType,
  RegisterUserSchemaType,
} from '@/lib/schemas';
import { axiosInstance, axiosPrivate } from '@/lib/api/axios';
import { HelpersData } from '@/types/authHelpers.type';
import axios, { AxiosResponse, isAxiosError } from 'axios';
import { supabase } from '@/context/supabaseClient';

export async function registerUser(
  fields: Omit<RegisterUserSchemaType, 'password' | 'confirmPassword'>
): Promise<Response<AuthType>> {
  try {
    console.log('Registering user with fields:', fields);
    console.log('Using endpoint:', authEndpoints.REGISTER_USER);
    console.log('Using base URL:', import.meta.env.VITE_API_URL);

    const response: Response<AuthType> = await axiosInstance.post(
      authEndpoints.REGISTER_USER,
      fields, // Don't stringify the data, let axios handle it
      {
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        withCredentials: false,
      }
    );
    console.log('Registration response:', response);
    return response;
  } catch (error) {
    console.error('Registration error:', error);
    let errorMessage = 'Algo salio mal, vuelve a intentarlo!';

    if (isAxiosError(error)) {
      console.error('Axios error details:', {
        status: error.response?.status,
        data: error.response?.data,
        headers: error.response?.headers,
        config: {
          url: error.config?.url,
          method: error.config?.method,
          headers: error.config?.headers,
          data: error.config?.data,
        },
      });
      errorMessage = error.response?.data.message || errorMessage;
    }

    return { error: errorMessage };
  }
}

export async function registerCompany(
  fields: RegisterCompanySchemaType
): Promise<{ companyId: string; error?: string }> {
  try {
    console.log('Registering company with fields:', fields);
    console.log('Using endpoint:', authEndpoints.REGISTER_COMPANY);
    console.log('Using base URL:', import.meta.env.VITE_API_URL);

    const { data: response } = await axiosInstance.post(
      authEndpoints.REGISTER_COMPANY,
      fields, // Don't stringify the data, let axios handle it
      {
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        withCredentials: false,
      }
    );
    console.log('Registration response:', response);
    return { companyId: response.data.companyId };
  } catch (error) {
    console.error('Registration error:', error);
    let errorMessage = 'Algo salio mal, vuelve a intentarlo!';

    if (isAxiosError(error)) {
      console.error('Axios error details:', {
        status: error.response?.status,
        data: error.response?.data,
        headers: error.response?.headers,
        config: {
          url: error.config?.url,
          method: error.config?.method,
          headers: error.config?.headers,
          data: error.config?.data,
        },
      });
      errorMessage = error.response?.data.message || errorMessage;
    }

    return { companyId: '', error: errorMessage };
  }
}

export async function getProfile(userId: string): Promise<AuthType> {
  try {
    console.log('Getting profile for user:', userId);
    console.log('Using endpoint:', `${authEndpoints.PROFILE}/${userId}`);

    const { data: response }: AxiosResponse = await axiosPrivate.get(
      `${authEndpoints.PROFILE}/${userId}`,
      {
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        withCredentials: true,
      }
    );
    console.log('Profile response:', response);

    // Get the session to include user metadata
    const session = localStorage.getItem('sb-auth-token');
    if (session) {
      const { user_metadata } = JSON.parse(session);
      if (user_metadata) {
        response.data.user.user_metadata = user_metadata;
      }
    }

    return response.data;
  } catch (error) {
    console.error('Profile error:', error);
    if (isAxiosError(error)) {
      console.error('Axios error details:', {
        status: error.response?.status,
        data: error.response?.data,
        headers: error.response?.headers,
        config: {
          url: error.config?.url,
          method: error.config?.method,
          headers: error.config?.headers,
          withCredentials: error.config?.withCredentials,
        },
      });

      if (error.response?.data.statusCode === 400) {
        error.message = 'Algo salio mal, vuelve a intentarlo!';
      } else {
        error.message = error.response?.data.message;
      }
    }

    throw error;
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
      errorMessage = error.message || errorMessage;
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
): Promise<GoogleLocationSchemaType> {
  const url = `https://places.googleapis.com/v1/places/${id}?fields=id,displayName,location&key=${import.meta.env.VITE_GOOGLE_MAPS_KEY}`;
  try {
    const { data } = await axios.get<GoogleLocationSchemaType>(url, {
      headers: { 'Content-Type': 'application/json' },
    });
    return data;
  } catch (error) {
    if (isAxiosError(error)) {
      if (error.response?.status === 400) {
        throw new Error('El email o la contraseña son incorrectos');
      }
      throw new Error(
        error.response?.data?.message || 'Algo salió mal, vuelve a intentarlo!'
      );
    }
    throw new Error('Algo salió mal, vuelve a intentarlo!');
  }
}
