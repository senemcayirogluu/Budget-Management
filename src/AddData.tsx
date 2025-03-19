import React, { useEffect, useState } from "react";
import "./AddData.css";
import { useNavigate } from "react-router-dom";
import { useStateValue } from "./StateProvider";
import "react-datepicker/dist/react-datepicker.css";
import DatePicker, { registerLocale } from "react-datepicker";
import { tr } from "date-fns/locale/tr";
import { parseISO, startOfDay } from "date-fns";
import { useTranslation } from "react-i18next";
import axios from "axios";

registerLocale("tr", tr);

const AddData = ({ onClose, onDataAdded }: { onClose: () => void; onDataAdded: () => void }) => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [{ data }, dispatch] = useStateValue();

  const [id, setId] = useState<number>(data.length + 1);
  const [budget, setBudget] = useState<number | string>("");
  const [description, setDescription] = useState<string>("");
  const [earning, setEarning] = useState<number | string>(t("earning"));
  const [spending, setSpending] = useState<number | string>(t("spending"));
  const [situationOption, setSituationOption] = useState<string>(
    earning?.toString() || spending?.toString() || ""
  );
  const [date, setDate] = useState<Date | null>();
  const [error, setError] = useState<string>("");

  const locale = i18n.language === "tr" ? "tr" : "en";
  const dateFormat = i18n.language === "tr" ? "dd/MM/yyyy" : "MM/dd/yyyy";

  const addData = async () => {
    if (!budget || !description || !situationOption || !date) {
      setError(t("fill the form"));
      return;
    }

    const newId = id;
    setId((prevId) => prevId + 1);

    const newData = {
      id: newId,
      budget: budget,
      description: description,
      earning: situationOption === "earning" ? earning : null,
      spending: situationOption === "spending" ? spending : null,
      date: date.toISOString().split('T')[0],
    };

    dispatch({
      type: "ADD_DATA",
      item: newData,
    });  

    try {
      await axios.post("http://localhost:8080/transactions/add", newData); 
      onDataAdded(); 

      setBudget("");
      setDescription("");
      setEarning("");
      setSpending("");
      setSituationOption("");
      setDate(startOfDay(new Date()));
      setError("");

      setTimeout(() => {
        navigate("/"); 
      }, 500);

      onClose();
    } catch (error) {
      setError(t("error adding data"));
    }
  };

  const handleSituationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSituationOption(value);

    if (value === "earning") {
      setEarning(t("earning"));
      setSpending("");
    } else {
      setSpending(t("spending"));
      setEarning("");
    }
  };
  
  return (
    <div className="addData">
      <div className="data_info">
        <h5>{t("budget amount")}: </h5>
        <input
          type="text"
          value={budget}
          onChange={(e) => setBudget(e.target.value)}
        />

        <h5>{t("description")}: </h5>
        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <h5>{t("earning or spending")}: </h5>
        <div className="earn_spend">
          <label className="container">
            {t("earning")}
            <input
              type="radio"
              name="situationOption"
              value="earning"
              checked={situationOption === "earning"}
              onChange={handleSituationChange}
            />
            <span className="checkmark"></span>
          </label>
          <label className="container">
            {t("spending")}
            <input
              type="radio"
              name="situationOption"
              value="spending"
              checked={situationOption === "spending"}
              onChange={handleSituationChange}
            />
            <span className="checkmark"></span>
          </label>
        </div>

        <h5>{t("date")}: </h5>
        <div>
          <DatePicker
            locale={locale}
            dateFormat={dateFormat}
            selected={date}
            onChange={(date: Date | null) => setDate(date)}
            className="dataDate"
          />
        </div>
      </div>

      {error && <p className="error_message">{error}</p>}

      <button className="button_add" onClick={addData}>
        {t("add data")}
      </button>
      <button className="button_cancel" onClick={onClose}>
        {t("cancel")}
      </button>
    </div>
  );
};

export default AddData;
