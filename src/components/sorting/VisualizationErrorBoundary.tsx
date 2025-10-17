"use client";

import { Component, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { ErrorBoundaryState } from "@/lib/types";

export class VisualizationErrorBoundary extends Component<
  { children: ReactNode },
  ErrorBoundaryState
> {
  private errorCount: number = 0;
  private lastErrorTime: number = 0;

  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(_: Error) {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    const now = Date.now();

    // Prevent infinite loops by limiting error frequency
    if (now - this.lastErrorTime < 1000) {
      this.errorCount++;
    } else {
      this.errorCount = 1;
    }

    this.lastErrorTime = now;

    console.error(
      "Visualization error:",
      error,
      errorInfo,
      `Error count: ${this.errorCount}`,
    );

    // If we get too many errors in quick succession, don't try to recover
    if (this.errorCount > 3) {
      console.error("Too many errors, stopping recovery attempts");
      return;
    }
  }

  resetError = () => {
    this.errorCount = 0;
    this.setState({ hasError: false });
  };

  render() {
    if (this.state.hasError) {
      return (
        <Card className="w-full max-w-md mx-auto mt-8">
          <CardHeader>
            <CardTitle>Visualization Error</CardTitle>
            <CardDescription>
              Something went wrong with the visualization. This can happen with
              large arrays or complex algorithms.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <Button onClick={this.resetError}>Try Again</Button>
            <div className="text-xs text-muted-foreground">
              Tip: Try reducing the array size or selecting a different
              algorithm.
            </div>
          </CardContent>
        </Card>
      );
    }

    return this.props.children;
  }
}
