// ================================================================
// REACT ERROR BOUNDARY — Last Line of Defense Against White Screens
// ================================================================
// React Error Boundaries are CLASS components (not hooks) because
// React's error lifecycle methods (getDerivedStateFromError and
// componentDidCatch) are only available on class components.
//
// HOW IT WORKS:
// 1. When any child component throws during rendering, React calls
//    getDerivedStateFromError(error) SYNCHRONOUSLY before the next
//    render. We set hasError=true to trigger the fallback UI.
//
// 2. componentDidCatch(error, errorInfo) fires ASYNCHRONOUSLY after
//    the fallback renders. This is where we log the error. In the
//    future, this can be extended to send errors to Sentry/LogRocket.
//
// 3. The fallback UI shows a branded SVIST error page with a
//    "Reload" button. This is infinitely better than a blank white
//    page that makes users think the site is broken.
//
// WHAT IT CATCHES:
// ✅ Errors during rendering (JSX evaluation)
// ✅ Errors in lifecycle methods
// ✅ Errors in constructors of child components
//
// WHAT IT DOES NOT CATCH:
// ❌ Event handlers (use try/catch in the handler)
// ❌ Async code (use .catch() or try/catch in async functions)
// ❌ Server-side rendering
// ❌ Errors thrown in the Error Boundary itself
// ================================================================

import React from "react";
import { AlertCircle } from "lucide-react";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  /**
   * Called synchronously during rendering when a child throws.
   * The returned object is merged into this.state.
   * This triggers a re-render with the fallback UI.
   */
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  /**
   * Called after the fallback UI has rendered.
   * errorInfo.componentStack contains the component tree trace
   * showing exactly which component threw and its parent chain.
   */
  componentDidCatch(error, errorInfo) {
    console.error("[ErrorBoundary] Uncaught render error:", error);
    console.error("[ErrorBoundary] Component stack:", errorInfo.componentStack);
    // FUTURE: Send to error monitoring service (Sentry, LogRocket, etc.)
    // Sentry.captureException(error, { extra: errorInfo });
  }

  /**
   * Reset the error state so the user can try again.
   * window.location.reload() is used instead of just resetting state
   * because the error might have corrupted React's internal fiber tree.
   * A full page reload guarantees a clean slate.
   */
  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
            <div className="bg-red-500 p-8 text-center">
              <AlertCircle className="w-16 h-16 text-white mx-auto mb-4" />
              <h1 className="text-2xl font-black text-white">
                Something Went Wrong
              </h1>
              <p className="text-red-100 font-medium mt-2 text-sm">
                The SVIST Portal encountered an unexpected error.
              </p>
            </div>
            <div className="p-8 text-center">
              <p className="text-slate-600 mb-6 text-sm leading-relaxed">
                This issue has been logged automatically. Please reload
                the page to continue. If the problem persists, contact the
                IT department.
              </p>
              {process.env.NODE_ENV !== "production" && this.state.error && (
                <pre className="bg-slate-50 border border-slate-200 rounded-lg p-4 text-xs text-red-600 text-left overflow-auto max-h-32 mb-6 font-mono">
                  {this.state.error.toString()}
                </pre>
              )}
              <button
                onClick={this.handleReload}
                className="w-full rounded-lg bg-[#1e3a8a] py-4 text-center font-bold text-white transition-colors hover:bg-blue-900 text-lg shadow-md"
              >
                Reload Portal
              </button>
            </div>
          </div>
        </div>
      );
    }

    // No error — render children normally
    return this.props.children;
  }
}

export default ErrorBoundary;
