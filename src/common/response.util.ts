export interface ApiResponse<T> {
  status: number;
  message: string;
  data?: T;
}

export const returnResponse = <T>(
  status: number,
  message: string,
  data?: T,
): ApiResponse<T> => {
  return {
    status,
    message,
    data,
  };
};
