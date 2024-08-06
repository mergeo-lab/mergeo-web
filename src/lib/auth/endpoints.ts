export enum authEndpoints {
  API_BASE = '/api/auth',
  LOGIN = `${API_BASE}/login`,
  PASSWORD_RESET = `${API_BASE}/new-password`,
  PASSWORD_RECOVER = `${API_BASE}/password-recover`,
  REGISTER_USER = `${API_BASE}/register/user`,
  INVITE_USER = `/add/user`,
  REGISTER_COMPANY = `${API_BASE}/register/company`,
  OTP = `${API_BASE}/verify`,
  LOGOUT = `${API_BASE}/logout`,
  HELPERS = `${API_BASE}/helpers`,
}

export const addUserEndpoint = (id: string): string => {
  return `${authEndpoints.API_BASE}/${id}${authEndpoints.INVITE_USER}`;
};
