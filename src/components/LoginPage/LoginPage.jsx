
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  LogIn,
  Mail,
  Lock,
  Eye,
  EyeOff,
} from "lucide-react";
import axios from "axios";

import freshMartLogo from "../../assets/freshmart-logo.svg";
import { adminLoginStyles as s } from "../../assets/dummyStyles";

const API_URL = (
  import.meta.env.VITE_API_URL || "https://freshmart-backend-nyac.onrender.com"
).replace(/\/$/, "");

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || "/dashboard";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email.trim() || !password) {
      setError("Please enter your email and password.");
      return;
    }

    setIsLoading(true);

    try {
      const { data } = await axios.post(
        `${API_URL}/api/users/login`,
        {
          email: email.trim(),
          password,
        }
      );

      if (!data.success) {
        setError(data.message || "Login failed.");
        return;
      }

      if (data.user?.role !== "admin") {
        setError("This account does not have admin access.");
        return;
      }

      if (!data.token) {
        setError("Authentication token was not received.");
        return;
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem(
        "freshmart_user",
        JSON.stringify(data.user)
      );

      navigate(from, { replace: true });
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Login failed. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={s.mainContainer}>
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className={s.glow1} />
        <div className={s.glow2} />
        <div className={s.glow3} />
      </div>

      <div className={s.contentWrapper}>
        <div className={s.brandHeader}>
          <div className={s.brandInner}>
            <div className={s.logoWrapper}>
              <img
                src={freshMartLogo}
                alt="FreshMart logo"
                className={s.logoImage}
              />
            </div>

            <div className="leading-tight">
              <p className={s.adminLabel}>Admin Panel</p>
              <h1 className={s.brandTitle}>FreshMart</h1>
            </div>
          </div>
        </div>

        <div className={s.card}>
          <div className={s.cardTopLine} />

          <form
            onSubmit={handleSubmit}
            className={s.form}
          >
            {error && (
              <div
                className={s.errorContainer}
                role="alert"
              >
                <div className={s.errorDot} />
                {error}
              </div>
            )}

            <div className={s.fieldGroup}>
              <label
                htmlFor="email"
                className={s.fieldLabel}
              >
                Email Address
              </label>

              <div className={s.fieldWrapper}>
                <div className={s.fieldGlow} />

                <div className={s.fieldInputContainer}>
                  <Mail className={s.fieldIcon} />

                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={email}
                    onChange={(e) =>
                      setEmail(e.target.value)
                    }
                    placeholder="Email Address"
                    className={s.fieldInput}
                    autoComplete="username"
                    required
                    autoFocus
                  />
                </div>
              </div>
            </div>

            <div className={s.fieldGroup}>
              <label
                htmlFor="password"
                className={s.fieldLabel}
              >
                Password
              </label>

              <div className={s.fieldWrapper}>
                <div className={s.fieldGlow} />

                <div className={s.fieldInputContainer}>
                  <Lock className={s.fieldIcon} />

                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) =>
                      setPassword(e.target.value)
                    }
                    placeholder="Enter your password"
                    className={s.fieldInputPassword}
                    autoComplete="current-password"
                    required
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword((prev) => !prev)
                    }
                    className={s.toggleButton}
                    aria-label={
                      showPassword
                        ? "Hide password"
                        : "Show password"
                    }
                  >
                    {showPassword ? (
                      <EyeOff className={s.toggleIcon} />
                    ) : (
                      <Eye className={s.toggleIcon} />
                    )}
                  </button>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={s.submitButton}
            >
              <span className={s.submitInner}>
                {isLoading ? (
                  <>
                    <div className={s.spinner} />
                    Signing in...
                  </>
                ) : (
                  <>
                    <LogIn className={s.submitIcon} />
                    Sign In
                  </>
                )}
              </span>
            </button>
          </form>
        </div>
      </div>

       <style>{`
        @keyframes spin-slow {
          0% {
            transform: translate(-50%, -50%) rotate(0deg);
          }
          100% {
            transform: translate(-50%, -50%) rotate(360deg);
          }
        }

        .animate-spin-slow {
          animation: spin-slow 20s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default LoginPage;
