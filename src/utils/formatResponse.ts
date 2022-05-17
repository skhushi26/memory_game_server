import { Response } from 'express';

export type FormattedResponse<T> = {
  result: T;
  statusCode: Number;
  message: String;
};

export function FormatResponse<T>(
  result: T,
  statusCode: number,
  message: string,
): FormattedResponse<T> {
  return {
    result,
    statusCode,
    message,
  };
}
