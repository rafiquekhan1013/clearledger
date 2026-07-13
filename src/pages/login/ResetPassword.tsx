import { Link, useNavigate, useParams } from "react-router-dom";
import { useUserResetPasswordMutation } from "../../services/auth.service";
import { useState, useEffect } from "react";

const ResetPassword = () => {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const [userResetPassword] = useUserResetPasswordMutation();
  const [isSuccess, setIsSuccess] = useState(false);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState("");
  const [data, setData] = useState({ password: "", cpassword: "" });

  useEffect(() => {
    if (!token) navigate("/");
  }, [token, navigate]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    setIsError(false);
    setError("");
    event.preventDefault();
    if (data.password !== data.cpassword) {
      setIsError(true);
      setError("Passwords do not match.");
      return;
    }
    const formData = new FormData(event.currentTarget);
    const password = formData.get("password") as string;
    try {
      await userResetPassword({ token, password }).unwrap();
      setIsSuccess(true);
      setTimeout(() => navigate("/"), 3000);
    } catch (e: unknown) {
      setIsError(true);
      const err = e as { data?: { message?: string } };
      setError(
        err?.data?.message ? err.data.message : "Invalid link, please try again."
      );
    }
  };

  if (!token) return null;

  return (
    <section className="py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Password Reset</h1>
        <div className="h-1 w-16 bg-blue-600 rounded-full mx-auto mb-4" />
        <p className="text-slate-600">Create a new password.</p>
      </div>
      <div className="bg-white border-2 border-slate-200 rounded-2xl shadow-lg p-8 max-w-md mx-auto">
        <form onSubmit={handleSubmit} method="POST" className="space-y-4">
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-1">
              New password
            </label>
            <input
              id="password"
              type="password"
              name="password"
              placeholder="Password"
              maxLength={256}
              required
              onChange={handleInputChange}
              className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition-all"
            />
          </div>
          <div>
            <label htmlFor="cpassword" className="block text-sm font-medium text-slate-700 mb-1">
              Confirm password
            </label>
            <input
              id="cpassword"
              type="password"
              name="cpassword"
              placeholder="Confirm password"
              maxLength={256}
              required
              onChange={handleInputChange}
              className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition-all"
            />
          </div>
          <button
            type="submit"
            className="w-full px-5 py-3 text-sm font-semibold rounded-xl text-white bg-gradient-to-r from-blue-500 to-blue-600 shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all cursor-pointer"
          >
            Save
          </button>
        </form>
        {isSuccess && (
          <div className="mt-4 p-4 rounded-xl bg-blue-50 border border-blue-200">
            <p className="text-sm text-blue-800">Password reset. You can log in with your new password.</p>
          </div>
        )}
        {isError && (
          <div className="mt-4 p-4 rounded-xl bg-amber-50 border border-amber-200">
            <p className="text-sm text-amber-800">{error}</p>
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

export default ResetPassword;
