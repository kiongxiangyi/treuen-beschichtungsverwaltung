import React, { useState } from "react";
import { useForm } from "react-hook-form";
import Button from "react-bootstrap/Button";
import { useNavigate } from "react-router-dom";

export default function EntnahmeButton({
  fertigungsauftragDB,
  submittedOrders,
  filterDB,
  setWithdrawnOrders,
  setShow,
  arrCurrentQuantity,
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
      let selectedOrders = [];
      let withdrawnQuantityOfSelectedOrder;
      let fertigungsauftrag;
      let arrWithdrawnOrders = [];
      let currentQuantityOfSelectedOrder = [];
      //loop and update quantity of selected orders
      for (let i = 0; i < submittedOrders.length; i++) {
        selectedOrders = fertigungsauftragDB.filter(
          //current quantity in DB
          ({ Auftragsnummer, Lagerplatz }) =>
            Auftragsnummer === submittedOrders[i].Auftragsnummer &&
            Lagerplatz === submittedOrders[i].Lagerplatz
        );

        withdrawnQuantityOfSelectedOrder = filterDB.find(
          //withdrawal quantity input in frontend
          ({ Auftragsnummer, Lagerplatz }) =>
            Auftragsnummer === submittedOrders[i].Auftragsnummer &&
            Lagerplatz === submittedOrders[i].Lagerplatz
        );

        /* currentQuantityOfSelectedOrder = arrCurrentQuantity.find(
          ({ Auftragsnummer, Lagerplatz }) =>
            Auftragsnummer === submittedOrders[i].Auftragsnummer &&
            Lagerplatz === submittedOrders[i].Lagerplatz
        ); */
        console.log("selectedOrders", selectedOrders);
        console.log(
          "withdrawnQuantityOfSelectedOrder",
          withdrawnQuantityOfSelectedOrder
        );

        fertigungsauftrag = submittedOrders[i].Auftragsnummer;

        selectedOrders[0].Menge = withdrawnQuantityOfSelectedOrder.Menge; //update the withdrawal quantity on the booking summary page, selectedOrders is in array, so need to set the first array and change the Menge
        //selectedOrders[0].CurrentQty = currentQuantityOfSelectedOrder.Menge;

        arrWithdrawnOrders.push(...selectedOrders);

        //console.log("arrWithdrawnOrders", arrWithdrawnOrders);
        //update Auslagerung True for E-Label interface according to storage bins
        for (let i = 0; i < selectedOrders.length; i++) {
          let storageBin = selectedOrders[i].Lagerplatz;
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
