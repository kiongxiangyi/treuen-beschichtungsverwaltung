import React from "react";
import { useForm } from "react-hook-form";
import Button from "react-bootstrap/Button";
import { useNavigate } from "react-router-dom";

export default function EntnahmeButton({
  fertigungsauftragDB,
  submittedOrders,
  filterDB,
  setWithdrawnOrders,
  setShow,
}) {
  const navigate = useNavigate(); //hook for navigation

  const {
    //register,
    handleSubmit,
    //watch,
    reset,
    formState,
    //formState: { errors },
  } = useForm();

  const onSubmit = () => {
    if (submittedOrders.length > 0) {
      let selectedOrders;
      let withdrawnQuantityOfSelectedOrder;
      let fertigungsauftrag;
      let arrWithdrawnOrders = [];
      //loop and update quantity of selected orders
      for (let i = 0; i < submittedOrders.length; i++) {
        selectedOrders = fertigungsauftragDB.find(
          //current quantity in DB
          ({ Auftragsnummer }) =>
            Auftragsnummer === submittedOrders[i].Auftragsnummer
        );
        withdrawnQuantityOfSelectedOrder = filterDB.find(
          //withdrawal quantity input in frontend
          ({ Auftragsnummer }) =>
            Auftragsnummer === submittedOrders[i].Auftragsnummer
        );

        fertigungsauftrag = submittedOrders[i].Auftragsnummer;

        let newQuantity =
          selectedOrders.Menge - withdrawnQuantityOfSelectedOrder.Menge;

        let withdrawnQuantity = withdrawnQuantityOfSelectedOrder.Menge;

        arrWithdrawnOrders.push({
          ...selectedOrders,
          newQty: newQuantity,
          withdrawnQty: withdrawnQuantity,
        }); //save orders of loops in a local variable because useState does not render in loop

        //Auslagerung in DB set TRUE
        fetch(`${process.env.REACT_APP_API}/Auftragsnummer/Entnahme`, {
          method: "PUT",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            fertigungsauftrag,
          }),
        })
          .then((res) => res.json())
          .catch((err) => console.log(err));
      }

      setWithdrawnOrders(arrWithdrawnOrders); //save the orders in useState
      setShow(true);
    } else {
    }
  };

  //jump to Wareneingang
  const handleWareneingang = (event) => {
    navigate("/Wareneingang");
  };

  //reset form tutorial https://react-hook-form.com/api/useform/reset/
  React.useEffect(() => {
    if (formState.isSubmitSuccessful) {
      reset();
    }
  }, [formState, reset]);

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Button
          variant="outline-secondary"
          className="modalButton"
          type="submit"
        >
          Weiter
        </Button>
      </form>
      <Button
        variant="outline-secondary"
        className="modalButton"
        onClick={handleWareneingang}
      >
        Teilmenge Rückgabe
      </Button>
    </div>
  );
}
