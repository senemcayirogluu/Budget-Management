import React, { useEffect, useState } from "react";
import "./Account.css";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import axios from "axios";

const Account:React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [username, setUsername] = useState<string>("");
  const [firstname, setFirstname] = useState<string>("");
  const [lastname, setLastname] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    axios.get("http://localhost:8080/users", { withCredentials: true })
      .then((response) => {
        const data = response.data;
        setUsername(data.username);
        setFirstname(data.firstname);
        setLastname(data.lastname);
        setEmail(data.email);
      })
      .catch((error) => {
        console.error("Kullanıcı bilgileri alınırken hata oluştu:", error);
      });
  }, []);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      const response = await axios.put("http://localhost:8080/users", 
        { username, firstname, lastname, email, password },
        { withCredentials: true }
      );
      setMessage(t("update_success"));
      setTimeout(() => navigate("/myAccount"), 2000); 
    } catch (error) {
      setMessage(t("update_failed")); 
      console.error("Güncelleme başarısız:", error);
    }
  };


  return (
    <div className="account">
      <h2>{t("profile")}</h2>

      {message && <p className="message">{message}</p>}

      <form className="account_container" onSubmit={handleSubmit}>
        <h5>{t("username")}:</h5>
        <input type="text" value={username} onChange={(e) => setUsername(e.target.value)}/>

        <h5>{t("firstname")}:</h5>
        <input type="text" value={firstname} onChange={(e) => setFirstname(e.target.value)}/>

        <h5>{t("lastname")}:</h5>
        <input type="text" value={lastname} onChange={(e) => setLastname(e.target.value)}/>

        <h5>{t("email")}:</h5>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}/>

        <h5>{t("password")}:</h5>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}/>
      </form>

      <button className="accountUpdate_button">{t("update")}</button>
      <button className="accountCancel_button">{t("cancel")}</button>
    </div>
  );
};

export default Account;
