import { AxiosError } from "axios";
import { ApiErrorPayload, ValidationErrorDetail } from "../types/api.types";

export function extractErrorMessage(error: any, fallbackMessage = "An unexpected error occurred."): string {
  if (!error) return fallbackMessage;

  if (typeof error === "string") return error;

  if (error instanceof AxiosError || error.isAxiosError) {
    const serverResponse = error.response?.data as ApiErrorPayload | undefined;
    if (serverResponse?.message) {
      return serverResponse.message;
    }
    if (error.message) {
      return error.message;
    }
  }

  if (error?.message) {
    return error.message;
  }

  return fallbackMessage;
}

export function extractFieldErrors(error: any): Record<string, string> {
  const result: Record<string, string> = {};

  if (!error || !(error instanceof AxiosError || error.isAxiosError)) {
    return result;
  }

  const serverResponse = error.response?.data as ApiErrorPayload | undefined;
  const errors = serverResponse?.errors;

  if (Array.isArray(errors)) {
    errors.forEach((err: ValidationErrorDetail) => {
      if (err.field && err.message) {
        result[err.field] = err.message;
      }
    });
  }

  return result;
}
