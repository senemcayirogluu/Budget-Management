import React, { useState } from "react";
import "./Login.css";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import axios from "axios";

const Login: React.FC<{ setAuthenticate: (authenticate: boolean) => void }> = (
  props
) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    try {
      const response = await axios.post("http://localhost:8080/users/authenticate",{
          username,
          password,
        }
      );

      console.log("Server response:", response.data);

      const { accessToken, refreshToken } = response.data;
      if (accessToken && refreshToken) {
        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("refreshToken", refreshToken);

        try {
          const payload = JSON.parse(atob(accessToken.split(".")[1])); 
          console.log("Decoded Token:", payload);
  
          if (payload?.userId) {
            localStorage.setItem("userId", payload.userId);
          } else {
            throw new Error("userId not found in token");
          }
        } catch (error) {
          console.error("Token decoding error:", error);
        }

        console.log("Giriş başarılı:", response.data);
        props.setAuthenticate(true);
        navigate("/");
      } else {
        throw new Error("Invalid token structure");
      }
    } catch (err: any) {
      console.error("Giriş başarısız:", err);
      setError(t("Invalid username or password"));
    }
  };

  return (
    <div className="login">
      <h2>{t("log in")}</h2>

      <form className="login_container" onSubmit={handleSubmit}>
        <h5>{t("username")}:</h5>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />

        <h5>{t("password")}:</h5>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        {error && <p className="error_message">{error}</p>}

        <button className="login_button" type="submit">
          {t("log in")}
        </button>
        <button
          className="loginCreate_button"
          type="button"
          onClick={() => navigate("/register")}
        >
          {t("have an account")}?
        </button>
      </form>
    </div>
  );
};

export default Login;
