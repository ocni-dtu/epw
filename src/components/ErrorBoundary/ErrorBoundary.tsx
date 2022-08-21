import React, { Component, ErrorInfo, ReactNode } from "react";
import { ErrorMessage } from "../ErrorMessage";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: undefined
  };

  public static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return <ErrorMessage error={this.state.error}/>;
    }

    return this.props.children;
  }
}

export default ErrorBoundary;