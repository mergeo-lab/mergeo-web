export enum authEndpoints {
  API_BASE = '/api/auth',
  LOGIN = `${API_BASE}/login`,
  PASSWORD_RESET = `${API_BASE}/new-password`,
  PASSWORD_RECOVER = `${API_BASE}/password-recover`,
  REGISTER_USER = `${API_BASE}/register/user`,
  REGISTER_COMPANY = `${API_BASE}/register/company`,
  OTP = `${API_BASE}/verify`,
  LOGOUT = `${API_BASE}/logout`,
  HELPERS = `${API_BASE}/helpers`,
}
