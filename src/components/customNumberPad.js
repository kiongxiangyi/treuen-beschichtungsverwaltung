import React, { useState } from "react";
import styled, { css } from "styled-components";

const NumberPadContainer = styled.div`
  display: ${(props) => (props.visible ? "block" : "none")};
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`;

const NumberPadGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 40px);
  gap: 5px;
`;

const NumberButton = styled.button`
  width: 40px;
  height: 40px;
  border: 1px solid #ccc;
  border-radius: 5px;
  background-color: #fff;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s;

  &:focus {
    outline: none;
  }

  ${(props) =>
    props.clicked &&
    css`
      background-color: lightblue;
    `}

  &:active {
    background-color: lightblue; /* Change to the color you want */
  }
`;

const DeleteButton = styled(NumberButton)`
  color: red;
`;

const ConfirmButton = styled(NumberButton)`
  color: green;
`;

const CustomNumberPad = ({ visible, onConfirm, onHide, setInputValue }) => {
  const [value, setValue] = useState("");

  const handleNumberClick = (number) => {
    setValue(value + number); // Update the value when a number button is clicked
  };

  const handleDelete = () => {
    setValue(value.slice(0, -1)); // Remove the last character from the value
  };

  const handleConfirm = () => {
    onConfirm(value); // Pass the value to the parent component when the "OK" button is clicked
    setValue(""); // Clear the value after confirming
    onHide(); // Hide the number pad
  };

  return (
    <NumberPadContainer visible={visible}>
      <NumberPadGrid>
        <NumberButton onClick={() => handleNumberClick("1")}>1</NumberButton>
        <NumberButton onClick={() => handleNumberClick("2")}>2</NumberButton>
        <NumberButton onClick={() => handleNumberClick("3")}>3</NumberButton>
        <DeleteButton onClick={handleDelete}>Del</DeleteButton>
        <NumberButton onClick={() => handleNumberClick("4")}>4</NumberButton>
        <NumberButton onClick={() => handleNumberClick("5")}>5</NumberButton>
        <NumberButton onClick={() => handleNumberClick("6")}>6</NumberButton>
        <ConfirmButton onClick={handleConfirm}>OK</ConfirmButton>
        <NumberButton onClick={() => handleNumberClick("7")}>7</NumberButton>
        <NumberButton onClick={() => handleNumberClick("8")}>8</NumberButton>
        <NumberButton onClick={() => handleNumberClick("9")}>9</NumberButton>
      </NumberPadGrid>
    </NumberPadContainer>
  );
};

export default CustomNumberPad;
