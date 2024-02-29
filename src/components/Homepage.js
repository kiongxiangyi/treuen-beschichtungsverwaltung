import "../App.css";
import { useNavigate } from "react-router-dom";
import Header from "./Header";

export default function Homepage({ rueckgabe }) {
  const navigate = useNavigate(); //hook for navigation

  const handleSubmitWareneingang = (e) => {
    e.preventDefault();
    navigate("/Wareneingang");
  };

  const handleSubmitEntnahme = (e) => {
    e.preventDefault();
    navigate("/Entnahme");
  };

  const handleSubmitRückgabe = (e) => {
    e.preventDefault();
    navigate("/Rueckgabe");
  };

  return (
    <div>
      <Header rueckgabe={rueckgabe} />
      {!rueckgabe && (
        <div className="homepage">
          <button className="bookingButton" onClick={handleSubmitWareneingang}>
            Wareneingang
          </button>
        </div>
      )}
      {rueckgabe && (
        <div className="homepage">
          <button className="bookingButton" onClick={handleSubmitEntnahme}>
            Entnahme
          </button>
        </div>
      )}
      {rueckgabe && (
        <div className="homepage">
          <button className="bookingButton" onClick={handleSubmitRückgabe}>
            Rückgabe
          </button>
        </div>
      )}
    </div>
  );
}
