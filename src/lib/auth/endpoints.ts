export enum authEndpoints {
  API_BASE = '/api/auth',
  LOGIN_URL = `${API_BASE}/login`,
  PASSWORD_RESET = `${API_BASE}/new-password`,
  PASSWORD_RECOVER = `${API_BASE}/password-recover`,
  REGISTER_URL = `${API_BASE}/register`,
  OTP_URL = `${API_BASE}/verify`,
  LOGOUT_URL = `${API_BASE}/logout`,
}
