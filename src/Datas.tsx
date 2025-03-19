import React, { useState } from "react";
import "./Datas.css";
import UpdateData from "./UpdateData";
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import { useStateValue } from "./StateProvider";
import { useTranslation } from "react-i18next";
import { set } from "date-fns";
import axios from "axios";

interface Props {
  id: number;
  budget: number;
  description: string;
  spending: string;
  earning: string;
  date: Date;
}

const Datas = ({ id, budget, description, spending, earning, date }: Props) => {
  const { t } = useTranslation();
  const [showPopUp, setShowPopUp] = useState<boolean>(false);
  const [selectedData, setSelectedData] = useState<Props | null>(null);
  const [, dispatch] = useStateValue();

  const handleDeleteData = async (id: number) => {
    try {
      await axios.delete(`http://localhost:8080/transactions/${id}`);
      dispatch({
        type: "REMOVE_DATA",
        id: id,
      });
      alert(t("data deleted successfully"));
    } catch (error) {
      console.error("Delete error:", error);
      alert(t("error deleting data"));
    }
  };

  const handleDataUpdate = async () => {
    try {
      const updatedData = { id, budget, description, spending, earning, date };
      await axios.put(`http://localhost:8080/transactions/${id}`, updatedData);

      setSelectedData(updatedData);
      setShowPopUp(!showPopUp);
    } catch (error) {
      console.error("Update error:", error);
      alert(t("error updating data"));
    }
  };

  //hata alırsak date yerine date.toISOString() yapabiliriz

  return (
    <div className="data">
      <RemoveCircleOutlineIcon  className="deleteIcon" onClick={() => handleDeleteData(id)}/>
      <div className="dataInfo">
        <p className="budget"><strong>{t("budget amount")}: </strong>{budget}</p>
        <p className="description"><strong>{t("description")}: </strong>{description}</p>
        <p className="date"><strong>{t("date")}: </strong>{date.toString()}</p>
        {spending ? (
          <p className="spending"><strong>{t("earning or spending")} </strong>{spending}</p>
        ) : (
          <p className="earning"><strong>{t("earning or spending")} </strong>{earning}</p>
        )}
      </div>
      <button className="dataUpdate_button" onClick={handleDataUpdate}>
        {t("data update")}
      </button>

      {showPopUp && selectedData && (
        <div className="updateData">
          <UpdateData data={selectedData} onClose={() => setShowPopUp(false)} />
        </div>
      )}
    </div>
  );
};

export default Datas;
