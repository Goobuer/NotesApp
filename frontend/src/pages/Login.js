import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import "./Login.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const login = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        alert(data.error || "Login failed. Please try again.");
        return;
      }
      localStorage.setItem("accessToken", data.accessToken);
      localStorage.setItem("refreshToken", data.refreshToken);
      const decoded = jwtDecode(data.accessToken);
      localStorage.setItem("email", decoded.email);
      navigate("/dashboard");
    } catch (error) {
      alert("Login failed. Please try again.");
    }
    setLoading(false);
  };

  const register = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        alert(data.error || "Registration failed. Please try again.");
        return;
      }
      alert("Registered! You can now login.");
      setIsLogin(true);
      setEmail("");
      setPassword("");
    } catch (error) {
      alert("Registration failed. Please try again.");
    }
    setLoading(false);
  };

  return (
    <div className="container login-container">
      <div className="card login-card">
        <h2 className="title">{isLogin ? "Welcome Back" : "Create Account"}</h2>
        <p className="subtitle">{isLogin ? "Sign in to your account" : "Join us today"}</p>

        {isLogin && (
          <div className="sample-credentials">
            <p className="sample-heading">Quick login</p>
            <p className="sample-text">user1@example.com / password123</p>
            <p className="sample-text">user2@example.com / password456</p>
          </div>
        )}

        <div className="form-group">
          <label className="label">Email Address</label>
          <input
            type="email"
            placeholder="your@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="input-field"
          />
        </div>

        <div className="form-group">
          <label className="label">Password</label>
          <input
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input-field"
          />
        </div>

        <button
          onClick={isLogin ? login : register}
          className="btn-primary action-button"
          disabled={loading}
          type="button"
        >
          {loading ? "Loading..." : isLogin ? "Sign In" : "Create Account"}
        </button>

        <p className="toggle-text">
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <button
            onClick={() => {
              setIsLogin(!isLogin);
              setEmail("");
              setPassword("");
            }}
            className="link-button"
            type="button"
          >
            {isLogin ? "Register" : "Login"}
          </button>
        </p>
      </div>
    </div>
  );
}

export default Login;
