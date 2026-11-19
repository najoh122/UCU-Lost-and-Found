// Small helpers shared by the real API and the demo (mock) API.
const TOKEN_KEY = 'ucu_token';

export const getToken = () => sessionStorage.getItem(TOKEN_KEY);
export const setToken = (t) =>
  t ? sessionStorage.setItem(TOKEN_KEY, t) : sessionStorage.removeItem(TOKEN_KEY);

export class ApiError extends Error {
  constructor(message, status, fieldErrors) {
    super(message);
    this.status = status;
    this.fieldErrors = fieldErrors || {};
  }
}
