import { Link, useNavigate } from "react-router-dom";
import { useUserForgotPasswordMutation } from "../../services/auth.service";
import { useState } from "react";

const ForgotPassword = () => {
  const [forgotPassword] = useUserForgotPasswordMutation();
  const [isSuccess, setIsSuccess] = useState(false);
  const [isError, setIsError] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    setIsError(false);
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const email = data.get("email") as string;
    try {
      const siteName = import.meta.env.VITE_SITE_NAME;
      await forgotPassword({
        email,
        ...(siteName && { siteName }),
      }).unwrap();
      setIsSuccess(true);
      setTimeout(() => navigate("/"), 3000);
    } catch {
      setIsError(true);
    }
  };

  return (
    <section className="py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Forgot Password</h1>
        <div className="h-1 w-16 bg-blue-600 rounded-full mx-auto mb-4" />
        <p className="text-slate-600">Enter your email to receive a reset link.</p>
      </div>
      <div className="bg-white border-2 border-slate-200 rounded-2xl shadow-lg p-8 max-w-md mx-auto">
        <form onSubmit={handleSubmit} method="POST" className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1">
              Email
            </label>
            <input
              id="email"
              type="email"
              name="email"
              placeholder="Email"
              maxLength={256}
              required
              className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition-all"
            />
          </div>
          <button
            type="submit"
            className="w-full px-5 py-3 text-sm font-semibold rounded-xl text-white bg-gradient-to-r from-blue-500 to-blue-600 shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all cursor-pointer"
          >
            Send reset link
          </button>
        </form>
        {isSuccess && (
          <div className="mt-4 p-4 rounded-xl bg-blue-50 border border-blue-200">
            <p className="text-sm text-blue-800">We have sent a reset password link to your email.</p>
          </div>
        )}
        {isError && (
          <div className="mt-4 p-4 rounded-xl bg-amber-50 border border-amber-200">
            <p className="text-sm text-amber-800">Invalid user, please try with correct entry.</p>
          </div>
        )}
      </div>
      <p className="text-center mt-6 text-slate-600 text-sm">
        <Link to="/" className="text-blue-600 font-medium hover:text-blue-700">
          Back to Home
        </Link>
      </p>
    </section>
  );
};

export default ForgotPassword;
