import { useNavigate } from "react-router-dom";
import "./Home.css";

function Account() {
  const navigate = useNavigate();
  const email = localStorage.getItem("email");

  const logout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("email");
    navigate("/");
  };

  return (
    <div className="container account-container">
      <div className="account-section">
        <h1 className="account-title">Account</h1>
        <p className="account-email">Email: {email}</p>
        <button className="logout-button" onClick={logout}>Logout</button>
      </div>
    </div>
  );
}

export default Account;
