import "../App.css";
import { useNavigate } from "react-router-dom";
import GoodsReceiptHeader from "./GoodsReceiptHeader";

export default function GoodsReceiptHomepage() {
  const navigate = useNavigate(); //hook for navigation

  const handleSubmitWareneingang = (e) => {
    e.preventDefault();
    navigate("/Wareneingang");
  };

  return (
    <div>
      <GoodsReceiptHeader />
      <div className="homepage">
        <button className="bookingButton" onClick={handleSubmitWareneingang}>
          Wareneingang
        </button>
      </div>
    </div>
  );
}
