import React, { useEffect, useState } from "react";
import "./UpdateData.css";
import { useStateValue } from "./StateProvider";
import "react-datepicker/dist/react-datepicker.css";
import DatePicker, { registerLocale } from "react-datepicker";
import { tr } from "date-fns/locale/tr";
import { parseISO, startOfDay } from "date-fns";
import { useTranslation } from "react-i18next";
import axios from "axios";

registerLocale("tr", tr);

const UpdateData = ({ onClose, data }: { onClose: () => void; data: any }) => {
  const { t, i18n } = useTranslation();
  const [{}, dispatch] = useStateValue();

  const [budget, setBudget] = useState<number | string>(data?.budget ?? "");
  const [description, setDescription] = useState<string>(
    data?.description ?? ""
  );
  const [earning, setEarning] = useState<number | string>(data?.earning ?? "");
  const [spending, setSpending] = useState<number | string>(data?.spending ?? "");
  const [situationOption, setSituationOption] = useState<string>(
    data?.earning !== undefined ? "earning" : data?.spending !== undefined ? "spending" : "");
  const [date, setDate] = useState<Date | null>(() => {
    if (!data?.date) return null;
    const parsedDate = new Date(data.date);
    if (isNaN(parsedDate.getTime())) return null;
    return new Date(parsedDate.getFullYear(), parsedDate.getMonth(), parsedDate.getDate());
  });

  const locale = i18n.language === "tr" ? "tr" : "en";
  const dateFormat = i18n.language === "tr" ? "dd/MM/yyyy" : "MM/dd/yyyy";

  const updateData = async() => {
    if (!data) return;

    const updatedData = {
      id: data.id,
      budget: budget ?? "",
      description: description ?? "",
      earning: situationOption === "earning" ? earning : null,
      spending: situationOption === "spending" ? spending : null,
      date: date ? date.toISOString().split("T")[0] : null,
    };

    console.log("Güncellenen veri:", updatedData);

    try {
      const response = await axios.put(`http://localhost:8080/transactions/${data.id}`, updatedData);
      console.log("Veri başarıyla güncellendi:", response.data);

      dispatch({
        type: "UPDATE_DATA",
        data: updatedData,
      });

      onClose();
    } catch (error) {
      console.error("Veri güncellenirken bir hata oluştu:", error);
      alert(t("error updating data"));
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
    <div className="update_data">
      <div className="dataInfo">
        <h5>{t("budget amount")}: </h5>
        <input
          type="text"
          value={budget ?? ""}
          onChange={(e) => setBudget(e.target.value)}
        />

        <h5>{t("description")}: </h5>
        <input
          type="text"
          value={description ?? ""}
          onChange={(e) => setDescription(e.target.value)}
        />

        <h5>{t("earning or spending")}: </h5>
        <div className="earnOrSpend">
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
            selected={date && !isNaN(date.getTime()) ? date : null}
            onChange={
              // (date: Date | null) => setDate(date)
              (date: Date | null) => {
                if (date) {
                  setDate(new Date(date.getFullYear(), date.getMonth(), date.getDate()));
                } else {
                  setDate(null);
                }
              }}
            className="dataDate"
          />
        </div>
      </div>
      <button className="button_update" onClick={updateData}>
        {t("data update")}
      </button>
      <button className="button_cancel" onClick={onClose}>
        {t("cancel")}
      </button>
    </div>
  );
};

export default UpdateData;
