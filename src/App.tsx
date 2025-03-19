import { Route, Routes } from "react-router-dom";
import "./App.css";
import Header from "./Header";
import Home from "./Home";
import Login from "./Login";
import Register from "./Register";
import Account from "./Account";
import { useTranslation } from "react-i18next";
import LanguageOutlinedIcon from "@mui/icons-material/LanguageOutlined";
import "./i18n";
import axios from "axios";
import { useEffect, useState } from "react";
import { useStateValue } from "./StateProvider";

function App() {
  const { t, i18n } = useTranslation();
  const [data, setData] = useState(null);
  const [authenticate, setAuthenticate] = useState<boolean>(false);
  const [{}, dispatch] = useStateValue();

  const fetchData = async () => {
    try {
      const response = await axios.get("https://localhost:8080");
      const token = localStorage.getItem("token");
      if (token) {
        const response = await axios.get(
          "https://localhost:8080/users/authenticate",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        dispatch({
          type: "SET_USER",
          user: { token, ...response.data },
        });
        setAuthenticate(true);
      } else {
        dispatch({
          type: "SET_USER",
          user: null,
        });
        setAuthenticate(false);
      }
      setData(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="App">
      <div>
        <button
          onClick={() =>
            i18n.changeLanguage(i18n.language === "en" ? "tr" : "en")
          }
          className="changeLanguage"
        >
          <LanguageOutlinedIcon style={{ fontSize: 30 }} />
        </button>
      </div>

      {data && <div>{JSON.stringify(data)}</div>}

      <Routes>
        <Route
          path="/"
          element={
            <>
              <Header />
              <Home />
            </>
          }
        />
        <Route
          path="/login"
          element={
            <>
              <Header />
              <Login setAuthenticate={setAuthenticate} />
            </>
          }
        />
        <Route
          path="/register"
          element={
            <>
              <Header />
              <Register />
            </>
          }
        />
        {authenticate && (
          <Route
            path="/myAccount"
            element={
              <>
                <Header />
                <Account />
              </>
            }
          />
        )}
      </Routes>
    </div>
  );
}

export default App;
