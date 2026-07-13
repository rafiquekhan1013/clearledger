import { useState } from "react";
import SignupComponent from "./SignupComponent";
import LoginComponent from "./LoginComponent";

interface PopupModalProps {
  code?: string;
  from?: string;
}

const PopupModal = ({ code }: PopupModalProps) => {
  const [isSignup, setIsSignup] = useState(true);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4"
      role="dialog"
      aria-modal="true"
      aria-label="Sign up or log in"
    >
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto border-2 border-slate-200">
        <div className="p-8">
          {isSignup ? (
            <SignupComponent code={code} />
          ) : (
            <LoginComponent />
          )}

          <div className="mt-6 text-center text-sm text-slate-600">
            {isSignup ? (
              <span>
                Already have an account?{" "}
                <button
                  type="button"
                  className="text-blue-600 font-semibold cursor-pointer hover:text-blue-700 ml-1 underline focus:outline-none focus:ring-2 focus:ring-blue-500/30 rounded"
                  onClick={() => setIsSignup(false)}
                >
                  Log In
                </button>
              </span>
            ) : (
              <span>
                Don&apos;t have an account?{" "}
                <button
                  type="button"
                  className="text-blue-600 font-semibold cursor-pointer hover:text-blue-700 ml-1 underline focus:outline-none focus:ring-2 focus:ring-blue-500/30 rounded"
                  onClick={() => setIsSignup(true)}
                >
                  Sign Up
                </button>
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PopupModal;
