
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
  const [email,setEmail]=useState("");
  const [password,setPassword]=useState("");
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const login = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/login",{
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({email,password})
      });
      const data = await res.json();
      localStorage.setItem("accessToken",data.accessToken);
      localStorage.setItem("refreshToken",data.refreshToken);
      navigate("/dashboard");
    } catch (error) {
      alert("Login failed. Please try again.");
    }
    setLoading(false);
  };

  const register = async () => {
    setLoading(true);
    try {
      await fetch("/api/register",{
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({email,password})
      });
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
    <div className="container" style={styles.container}>
      <div className="card" style={styles.card}>
        <h2 style={styles.title}>{isLogin ? "Welcome Back" : "Create Account"}</h2>
        <p style={styles.subtitle}>{isLogin ? "Sign in to your account" : "Join us today"}</p>
        
        <div style={styles.formGroup}>
          <label style={styles.label}>Email Address</label>
          <input 
            type="email"
            placeholder="your@email.com" 
            value={email}
            onChange={e=>setEmail(e.target.value)}
            style={styles.input}
          />
        </div>
        
        <div style={styles.formGroup}>
          <label style={styles.label}>Password</label>
          <input 
            type="password" 
            placeholder="••••••••" 
            value={password}
            onChange={e=>setPassword(e.target.value)}
            style={styles.input}
          />
        </div>
        
        <button 
          onClick={isLogin ? login : register}
          className="btn-primary"
          style={{...styles.button, width: '100%'}}
          disabled={loading}
        >
          {loading ? 'Loading...' : (isLogin ? 'Sign In' : 'Create Account')}
        </button>
        
        <p style={styles.toggleText}>
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <button 
            onClick={() => {
              setIsLogin(!isLogin);
              setEmail("");
              setPassword("");
            }}
            style={styles.linkButton}
          >
            {isLogin ? "Register" : "Login"}
          </button>
        </p>
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 'calc(100vh - 100px)',
    padding: '24px'
  },
  card: {
    width: '100%',
    maxWidth: '400px'
  },
  title: {
    fontSize: '28px',
    fontWeight: '700',
    color: '#2c3e50',
    marginBottom: '8px',
    textAlign: 'center'
  },
  subtitle: {
    color: '#7f8c8d',
    textAlign: 'center',
    marginBottom: '32px',
    fontSize: '14px'
  },
  formGroup: {
    marginBottom: '20px'
  },
  label: {
    display: 'block',
    marginBottom: '8px',
    color: '#2c3e50',
    fontWeight: '600',
    fontSize: '14px'
  },
  input: {
    width: '100%',
    padding: '12px 14px !important',
    border: '1px solid #e0e6ed !important',
    borderRadius: '8px !important'
  },
  button: {
    marginTop: '24px',
    marginBottom: '16px'
  },
  toggleText: {
    textAlign: 'center',
    color: '#7f8c8d',
    fontSize: '14px',
    marginBottom: 0
  },
  linkButton: {
    background: 'none',
    border: 'none',
    color: '#667eea',
    cursor: 'pointer',
    padding: '0 4px',
    fontWeight: '600',
    textDecoration: 'underline'
  }
};

export default Login;