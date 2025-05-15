export type Response<T> = {
  data?: T;
  error?: ErrorMessage;
};

export type ErrorMessage = string | string[];
