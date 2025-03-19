import React, { useState } from "react";
import "./Register.css";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import axios from "axios";

const Register: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [username, setUsername] = useState<string>("");
  const [firstname, setFirstname] = useState<string>("");
  const [lastname, setLastname] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (event:React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage(null);

    try {
      const response = await axios.post(`http://localhost:8080/users/register`, {
        username,
        firstname,
        lastname,
        email,
        password,
      });

      console.log("Kayıt başarılı: ", response.data);
      navigate("/");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setErrorMessage(error.response?.data?.message || t("register failed"));
        console.error("Axios error:", error.response?.data || error.message);
      } else {
        setErrorMessage(t("unexpected error"));
        console.error("Unexpected error:", error);
      }
    }
  };

  return (
    <div className="register">
      <h2>{t("register")}</h2>

      {errorMessage && <p className="error_message">{errorMessage}</p>}

      <form className="register_container" onSubmit={handleSubmit}>

        <h5>{t("username")}:</h5>
        <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} required />

        <h5>{t("firstname")}:</h5>
        <input type="text" value={firstname} onChange={(e) => setFirstname(e.target.value)} required />

        <h5>{t("lastname")}:</h5>
        <input type="text" value={lastname} onChange={(e) => setLastname(e.target.value)} required />
        
        <h5>{t("email")}:</h5>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />

        <h5>{t("password")}:</h5>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />

        <button className="register_button" type="submit">{t("register")}</button>

      </form>
    </div>
  );
};

export default Register;
