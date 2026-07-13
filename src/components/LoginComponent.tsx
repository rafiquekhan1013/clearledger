import { Link, useLocation, useNavigate } from "react-router-dom";
import { useUserLoginMutation } from "../services/auth.service";
import { storageService } from "../services/storage.service";
import { useState } from "react";
import { generateFingerprint } from "../utils/fingerprint";

const getSiteDisplayName = () => {
  const site = (import.meta.env.VITE_SITE_NAME || "").split(".")[0] || "";
  return site ? site.charAt(0).toUpperCase() + site.slice(1).toLowerCase() : "";
};

const LoginComponent = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [userLogin] = useUserLoginMutation();
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState<string>("");

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    setIsError(false);
    setError("");
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    try {
      const siteName = import.meta.env.VITE_SITE_NAME;
      const fingerprint = await generateFingerprint().catch(() => undefined);
      const resp = await userLogin({
        email,
        password,
        ...(siteName && { siteName }),
        ...(fingerprint && { fingerprint }),
      }).unwrap();
      const baSlug = resp.data?.clientBa?.slug ?? "studies";
      const accessToken = resp.Authorization;
      if (accessToken) storageService.setAccessToken(accessToken);
      if (baSlug !== "studies") storageService.setBaSlug(baSlug);

      if (location.pathname === "/login") {
        setTimeout(
          () => navigate(`/${baSlug}`),
          3000
        );
      } else {
        if (location.pathname === "/studies") {
          window.location.href = `${window.location.origin}/${baSlug}`;
        } else {
          if(location.pathname === "/survey") {
            window.location.reload();
          }else{
            window.location.href = `${window.location.origin}/${baSlug}`;
          }
          
        }
      }
    } catch (e: unknown) {
      const err = e as { data?: { message?: string } };
      setError(err?.data?.message ?? "Login failed.");
      setIsError(true);
    }
  };

  const inputClass =
    "w-full px-4 py-3 border-2 border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition-all";
  const btnClass =
    "w-full px-5 py-3 text-sm font-semibold rounded-xl text-white bg-gradient-to-r from-blue-500 to-blue-600 shadow-md hover:shadow-lg transition-all cursor-pointer";

  return (
    <div>
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Log In</h2>
        <div className="h-1 w-16 bg-blue-600 rounded-full mx-auto mb-2" />
        <p className="text-slate-600 text-sm">Login to explore {getSiteDisplayName()}</p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input className={inputClass} type="email" name="email" placeholder="Email" required />
        <input className={inputClass} type="password" name="password" placeholder="Password" required />
        <button type="submit" className={btnClass}>Log In</button>
        <div className="text-center">
          <Link to="/forgot-password" className="text-sm font-medium text-blue-600 hover:text-blue-700">
            Forgot password?
          </Link>
        </div>
      </form>
      {isError && (
        <p role="alert" className="mt-4 p-3 rounded-xl bg-amber-50 border border-amber-200 text-sm text-amber-800">
          {error}
        </p>
      )}
    </div>
  );
};

export default LoginComponent;
