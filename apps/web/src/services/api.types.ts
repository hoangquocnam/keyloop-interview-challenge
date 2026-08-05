export type ApiErrorPayload = {
  error?: string;
  message?: string | string[];
  statusCode?: number;
};

export type ApiSuccessResponse<TData> = {
  data: TData;
  statusCode: number;
  success?: boolean;
};

export type RequestJsonOptions = RequestInit;
