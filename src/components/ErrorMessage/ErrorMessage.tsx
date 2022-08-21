import React from "react";
import { Alert } from "@mui/material";

interface ErrorMessageProps {
  error: Error | unknown
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({error}) => {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  return <Alert data-testid="error-message" severity="error">{error?.message}</Alert>;
}