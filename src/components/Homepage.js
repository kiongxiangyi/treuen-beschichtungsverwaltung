import "../App.css";
import { useNavigate } from "react-router-dom";
//import Button from "react-bootstrap/Button";
import Button from "./Button";

export default function Homepage() {
  const navigate = useNavigate(); //hook for navigation

  const handleSubmitWareneingang = (e) => {
    e.preventDefault();
    navigate("/Wareneingang");
  };

  const handleSubmitEntnahme = (e) => {
    e.preventDefault();
    navigate("/Entnahme");
  };

  return (
    <>
      <div className="homepage">
        <form onSubmit={handleSubmitWareneingang}>
          <Button>Wareneingang</Button>
        </form>
      </div>
      <div className="homepage">
        <form onSubmit={handleSubmitEntnahme}>
          <Button>Entnahme</Button>
        </form>
      </div>
    </>
  );
}
