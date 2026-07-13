import { useState } from "react";
import { useUserUpdatePasswordMutation } from "../../services/surveyApi";

const Account = () => {
  const [userUpdatePassword] = useUserUpdatePasswordMutation();
  const [isSuccess, setIsSuccess] = useState(false);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState("");
  const [data, setData] = useState({ password: "", cpassword: "" });

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
      setError("Passwords don't match.");
      return;
    }
    const formData = new FormData(event.currentTarget);
    const old_password = formData.get("oldPassword") as string;
    const new_password = formData.get("password") as string;
    try {
      await userUpdatePassword({ old_password, new_password }).unwrap();
      setIsSuccess(true);
    } catch (e: unknown) {
      setIsError(true);
      const err = e as { data?: { message?: string } };
      setError(
        err?.data?.message
          ? err.data.message
          : "Something went wrong, please try later."
      );
    }
  };

  return (
    <section className="py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Manage Your Account</h1>
        <div className="h-1 w-24 bg-blue-600 rounded-full mb-4" />
        <p className="text-slate-600">Update your account password below.</p>
      </div>
      <div className="bg-white border-2 border-slate-200 rounded-2xl shadow-lg p-8 max-w-xl">
        <h2 className="text-xl font-semibold text-slate-900 mb-4">Change password</h2>
        <form onSubmit={handleSubmit} method="POST" className="space-y-4">
          <div>
            <label htmlFor="oldPassword" className="block text-sm font-medium text-slate-700 mb-1">
              Current password
            </label>
            <input
              id="oldPassword"
              type="password"
              name="oldPassword"
              placeholder="Current password"
              maxLength={256}
              required
              className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition-all"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-1">
              New password
            </label>
            <input
              id="password"
              type="password"
              name="password"
              placeholder="New password"
              maxLength={256}
              required
              onChange={handleInputChange}
              className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition-all"
            />
          </div>
          <div>
            <label htmlFor="cpassword" className="block text-sm font-medium text-slate-700 mb-1">
              Confirm new password
            </label>
            <input
              id="cpassword"
              type="password"
              name="cpassword"
              placeholder="Confirm new password"
              maxLength={256}
              required
              onChange={handleInputChange}
              className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition-all"
            />
          </div>
          <button
            type="submit"
            className="px-6 py-3 text-sm font-semibold rounded-xl text-white bg-gradient-to-r from-blue-500 to-blue-600 shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all cursor-pointer"
          >
            Save
          </button>
        </form>
        {isSuccess && (
          <div className="mt-6 p-4 rounded-xl bg-blue-50 border border-blue-200">
            <p className="text-sm text-blue-800">Your password has been updated.</p>
          </div>
        )}
        {isError && (
          <div className="mt-6 p-4 rounded-xl bg-amber-50 border border-amber-200">
            <p className="text-sm text-amber-800">{error}</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default Account;
