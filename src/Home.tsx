import React, { useEffect, useState } from "react";
import "./Home.css";
import Datas from "./Datas";
import { useStateValue } from "./StateProvider";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import AddData from "./AddData";
import "react-datepicker/dist/react-datepicker.css";
import DatePicker, { registerLocale } from "react-datepicker";
import { tr } from "date-fns/locale/tr";
import { getEarningTotal, getSpendingTotal } from "./reducer";
import { useTranslation } from "react-i18next";
import axios from "axios";

registerLocale("tr", tr);

const Home = () => {
  const { t, i18n } = useTranslation();
  const [{ data }, dispatch] = useStateValue();
  const [showPopUp, setShowPopUp] = useState<boolean>(false);
  const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([
    null,
    null,
  ]);
  const [startDate, endDate] = dateRange;
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const locale = i18n.language === "tr" ? "tr" : "en"; 
  const dateFormat = i18n.language === "tr" ? "dd/MM/yyyy" : "MM/dd/yyyy";

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get("http://localhost:8080/transactions");
        dispatch({
          type: "SET_DATA",
          payload: response.data,
        });
      } catch (err) {
        setError(t("error fetching data"));
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [dispatch]);


  const handleAddData = () => {
    setShowPopUp(!showPopUp);
  };
  
  const filteredData = data.filter((item: any) => {
    if (!item || typeof item.date !== 'string') return false;
    const itemDate = new Date(item.date.split(".").reverse().join("-"));
    return (!startDate || itemDate >= startDate) && (!endDate || itemDate <= endDate);
  });
  console.log("Filtered Data:", filteredData);

  const totalEarnings = getEarningTotal(filteredData);
  const totalSpending = getSpendingTotal(filteredData);
  const netTotal = totalEarnings - totalSpending;

  console.log("Güncellenmiş data:", data);

  return (
    <div className="home">
      <h2>{t("budget data")}</h2>

      {loading && <p>{t("loading")}</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      <div className="budgetSummary">
        <p><strong>{t("total earnings")}: </strong>{totalEarnings}₺</p>
        <p><strong>{t("total spending")}: </strong>{totalSpending}₺</p>
        <p><strong>{t("net balance")}: </strong>{netTotal}₺</p>
      </div>

      <div className="homeDate">
        <DatePicker
          placeholderText={t("select date range")}
          selectsRange={true}
          locale={locale}
          dateFormat={dateFormat}
          selected={startDate}
          startDate={startDate}
          endDate={endDate}
          onChange={(date: [Date | null, Date | null]) => {
            setDateRange(date);
          }}
          isClearable={true}
        />
      </div>

      <div className="budgetManagment">
        {filteredData.map(
          (item: any) =>
            item && (
              <Datas
                key={item.id}
                id={item.id}
                budget={item.budget}
                description={item.description}
                spending={item.spending}
                earning={item.earning}
                date={item.date}
              />
            )
        )}
      </div>

      <AddCircleOutlineIcon className="addIcon" onClick={handleAddData} />

      {showPopUp && (
        <div className="addDataToHome">
          <AddData onClose={() => setShowPopUp(false)} onDataAdded={() => setShowPopUp(false)}/>
        </div>
      )}
    </div>
  );
};

export default Home;
