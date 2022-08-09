import { useMachine } from "@xstate/react";
import { NextPage } from "next/types";
import { createMachine, StateValue } from "xstate";
import Header from "../../uikit/header";

type LightEvent = { type: "GO" } | { type: "ATTENTION" } | { type: "STOP" };
type LightContext = {};
type LightTypestate =
  | { value: "red"; context: LightContext }
  | { value: "yellow"; context: LightContext }
  | { value: "green"; context: LightContext };

const lightMachine =
  /** @xstate-layout N4IgpgJg5mDOIC5QBsCWUAWAXAdAJ0gGIBxAeUVAAcB7WVLVagOwpAA9EBaARgDYAOHAGZ+ABgDsATgCsAFl6zZAJn6TeAGhABPLn2k5JSocsn8Bo0bO78Avjc1pMuAhEIBBACoeAogDkPAJKkvqw0dAzMrBwIPALCYlJyCsqqGtpcogZGstKS3BZKObxKSuJ2DujYOFpgyMjUAO4k5EggYfSMLK3R4kI4vNKWcmLS3LKSQuKaOgjcONLiA7KiqpLicpO95SCOVTV1jYQAyh6kAAqhtB2R3bpGwuNyVqIyy+PTXLKChsa8EuL8JSSUS8ITbXa4KAEMBMY6nC6tdoRLqgaLcaz9fjccQgvgWSb8IQfWYYhYDVRCYriZZCJTgyqQ6Gwzw+fxBEKIq7IqKIXr9QY5L6iUbjSbEzjyHDKYxA0QqUx8MrbJjUCBwVgQ-CQS7hTo8mKlcTxCSAhZAgZpGaSSQ4bEDcRKaSTbgTXiSelOaq1eoNHXXFHsLhAnA4imjIS0p1CEHi7h9XKidHCxSElYAj1VKFgGF+7m3BAlJTCEoE0HjWRE9IxfI4EvyQ38BMWaQZrC5vX5zjRuYiE2Oh1qaSWoOTAz5YpxqTyISGOx2IA */
  createMachine<LightContext, LightEvent, LightTypestate>({
    context: {},
    id: "light",
    initial: "red",
    states: {
      red: {
        on: {
          GO: {
            target: "green",
          },
          ATTENTION: {
            target: "yellow",
          },
        },
      },
      yellow: {
        on: {
          GO: {
            target: "green",
          },
          STOP: {
            target: "red",
          },
        },
      },
      green: {
        on: {
          STOP: {
            target: "red",
          },
          ATTENTION: {
            target: "yellow",
          },
        },
      },
    },
  });

const TrafficLightPage: NextPage = () => {
  const [currentState, send] = useMachine(lightMachine);
  console.log(currentState.value);
  console.log(currentState.context);

  const renderActions = () => {
    return (
      <div>
        {currentState.value !== "green" && (
          <button
            onClick={(e) => {
              send({ type: "GO" });
            }}
          >
            Go
          </button>
        )}
        {currentState.value !== "yellow" && (
          <button
            onClick={(e) => {
              send({ type: "ATTENTION" });
            }}
          >
            Attention
          </button>
        )}
        {currentState.value !== "red" && (
          <button
            onClick={(e) => {
              send({ type: "STOP" });
            }}
          >
            Stop
          </button>
        )}
      </div>
    );
  };

  const renderLight = (value: StateValue) => {
    var lightString: string;

    switch (value) {
      case "red":
        lightString = "red";
        break;
      case "yellow":
        lightString = "yellow";
        break;
      case "green":
        lightString = "green";
        break;
      default:
        lightString = "blue";
    }

    return <p>{lightString}</p>;
  };

  return (
    <div>
      <Header />
      <p>
        {renderActions()}
        {renderLight(currentState.value)}
      </p>
    </div>
  );
};

export default TrafficLightPage;
