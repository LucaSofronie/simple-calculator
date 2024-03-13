import { useReducer } from "react";
import "./style.css";
import { DigitButton } from "./DigitButton";
import { OperationButton } from "./OperationButton";

export const ACTIONS = {
  ADD_DIGIT: "add-digit",
  DELETE: "delete",
  CHOOSE_OPERATION: "choose-operation",
  REMOVE_LAST: "remove-last",
  EQUAL: "equal",
};

function reducer(state, action) {
  switch (action.type) {
    case ACTIONS.ADD_DIGIT: {
      if (state.isOverwriting)
        return {
          ...state,
          currentOperand:
            action.payload.digit === "." ? "0." : action.payload.digit,
          isOverwriting: false,
        };
      if (action.payload.digit === "0" && state.currentOperand === "0")
        return state;
      if (action.payload.digit === "." && state.currentOperand == null)
        return {
          ...state,
          currentOperand: "0.",
        };
      if (action.payload.digit === "." && state.currentOperand.includes("."))
        return state;
      return {
        ...state,
        currentOperand: `${state.currentOperand || ""}${action.payload.digit}`,
      };
    }
    case ACTIONS.DELETE: {
      return {};
    }
    case ACTIONS.CHOOSE_OPERATION: {
      if (state.previousOperand == null && state.currentOperand == null)
        return state;
      if (state.previousOperand && state.currentOperand == null)
        return {
          ...state,
          operation: action.payload.operation,
        };
      if (state.previousOperand == null)
        return {
          ...state,
          operation: action.payload.operation,
          previousOperand: `${state.currentOperand}`,
          currentOperand: null,
        };
      return {
        ...state,
        operation: action.payload.operation,
        previousOperand: evaluate(state),
        currentOperand: null,
      };
    }
    case ACTIONS.EQUAL: {
      if (state.isOverwriting) return state;
      if (!state.currentOperand || !state.previousOperand || !state.operation)
        return state;
      return {
        currentOperand: evaluate(state),
        operation: null,
        previousOperand: null,
        isOverwriting: true,
      };
    }
    case ACTIONS.REMOVE_LAST: {
      if (state.isOverwriting)
        return {
          ...state,
          isOverwriting: false,
          currentOperand: null,
        };
      if (state.currentOperand == null) return state;
      return {
        ...state,
        currentOperand: state.currentOperand.slice(0, -1)
          ? state.currentOperand.slice(0, -1)
          : null,
      };
    }
  }
}

function evaluate(state) {
  let prev = parseFloat(state.previousOperand);
  let current = parseFloat(state.currentOperand);
  console.log(prev, current);
  if (isNaN(prev) || isNaN(current)) return "";
  let computation;
  switch (state.operation) {
    case "+":
      computation = (prev + current).toString();
      break;
    case "-":
      computation = (prev - current).toString();
      break;
    case "÷":
      computation = (prev / current).toString();
      break;
    case "*":
      computation = (prev * current).toString();
      break;
  }
  console.log(computation);
  return computation.toString();
}

function formatOperand(operand) {
  if (operand == null) return;
  const [integer, decimal] = operand.split(".");
  if (decimal == null) return INTEGER_FORMATTER.format(integer);
  return `${INTEGER_FORMATTER.format(integer)}.${decimal}`;
}

const INTEGER_FORMATTER = new Intl.NumberFormat("en-us", {
  maximumFractionDigits: 0,
});

function App() {
  const [
    { currentOperand, previousOperand, operation, isOverwriting },
    dispatch,
  ] = useReducer(reducer, {});

  return (
    <div className="calculator-grid">
      <div className="output">
        <div className="previous">
          {formatOperand(previousOperand)}
          {operation}
        </div>
        <div className="current">{formatOperand(currentOperand)}</div>
      </div>
      <button
        className="span-two"
        onClick={() => dispatch({ type: ACTIONS.DELETE })}
      >
        AC
      </button>
      <button onClick={() => dispatch({ type: ACTIONS.REMOVE_LAST })}>
        Del
      </button>
      <OperationButton operation="÷" dispatch={dispatch} />
      <DigitButton digit="1" dispatch={dispatch} />
      <DigitButton digit="2" dispatch={dispatch} />
      <DigitButton digit="3" dispatch={dispatch} />
      <OperationButton operation="*" dispatch={dispatch} />
      <DigitButton digit="4" dispatch={dispatch} />
      <DigitButton digit="5" dispatch={dispatch} />
      <DigitButton digit="6" dispatch={dispatch} />
      <OperationButton operation="+" dispatch={dispatch} />
      <DigitButton digit="7" dispatch={dispatch} />
      <DigitButton digit="8" dispatch={dispatch} />
      <DigitButton digit="9" dispatch={dispatch} />
      <OperationButton operation="-" dispatch={dispatch} />
      <DigitButton digit="." dispatch={dispatch} />
      <DigitButton digit="0" dispatch={dispatch} />
      <button
        className="span-two"
        onClick={() => dispatch({ type: ACTIONS.EQUAL })}
      >
        =
      </button>
    </div>
  );
}

export default App;
