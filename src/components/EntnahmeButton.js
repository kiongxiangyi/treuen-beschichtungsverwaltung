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
  setWithdrawnOrdersWithQuantity,
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
    //submitted Orders depend on Lagerplatz 0
    if (submittedOrders.length > 0) {
      let selectedOrdersWithoutQuantity = [];
      let withdrawnQuantityOfSelectedOrder;
      let fertigungsauftrag;
      let arrWithdrawnOrders = [];
      //loop and update quantity of selected orders
      for (let i = 0; i < submittedOrders.length; i++) {
        selectedOrdersWithoutQuantity = fertigungsauftragDB.filter(
          //current quantity in DB
          ({ Auftragsnummer, Lagerplatz }) =>
            Auftragsnummer === submittedOrders[i].Auftragsnummer &&
            Lagerplatz !== "0"
        );

        withdrawnQuantityOfSelectedOrder = filterDB.find(
          //withdrawal quantity input in frontend
          ({ Auftragsnummer }) =>
            Auftragsnummer === submittedOrders[i].Auftragsnummer
        );

        fertigungsauftrag = submittedOrders[i].Auftragsnummer;

        let withdrawnQuantity = withdrawnQuantityOfSelectedOrder.Menge;

        arrWithdrawnOrders.push(...selectedOrdersWithoutQuantity);

        //update Auslagerung True for E-Label interface according to storage bins
        for (let i = 0; i < selectedOrdersWithoutQuantity.length; i++) {
          let storageBin = selectedOrdersWithoutQuantity[i].Lagerplatz;
          //Auslagerung TRUE where Lagerplatz != 0 and update newQuantity
          fetch(
            `${process.env.REACT_APP_API}/Auftragsnummer/EntnahmeAuslagerungTrue`,
            {
              method: "PUT",
              headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
              },

              body: JSON.stringify({
                fertigungsauftrag,
                withdrawnQuantity,
                storageBin,
              }),
            }
          )
            .then((res) => res.json())
            .catch((err) => console.log(err));
        }
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
        Rückgabe
      </Button>
    </div>
  );
}
