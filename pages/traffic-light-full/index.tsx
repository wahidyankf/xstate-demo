import { NextPage } from "next/types";
import { assign, createMachine, StateValue } from "xstate";
import { useMachine } from "@xstate/react";

type LightEvent = { type: "GO" } | { type: "ATTENTION" } | { type: "STOP" };
type LightContext = {
  lastAction: "GO" | "STOP";
};
type LightTypestate =
  | { value: "red"; context: LightContext }
  | { value: "yellow"; context: LightContext }
  | { value: "green"; context: LightContext };

const lightMachine =
  /** @xstate-layout N4IgpgJg5mDOIC5QBsCWUAWAXAdAJ0gGIBxAeUVAAcB7WVLVagOwpAA9EBGAFk5wE4ArAGZOnAOziADMP7Dx-AEwAaEAE9Ew7gDYB-fQA4lB7VP6cDAX0uq0mXGrDJk1AO6E2sLAEMsYHN4AZn54ABSKUpEAlIR22DiOzm6sNHQMzKwcCDx8QqIS0rLySqoaCPxSOJHVioryRcLC1rbo8VAEYEyEAMoAKqQACim09IwsSOxcvAIiYpIycgoq6oiKgvx6+ouK4tzm-NY2IEzUEHCscbgEEMNpY5mIgoozosJS64LcUpyKBqWapk2-AM6x02iEnGaIEuCScLlct1GGQmWWEBkqim0gm0P0xBmEWO02n+CB2uj2WxkBnREPEUJh7TAnUR6XGoCy3GWZU4TxwRP5shk+UE9NaWBZ9xRXD+K2yVkOQA */
  createMachine<LightContext, LightEvent, LightTypestate>(
    {
      context: { lastAction: "STOP" },
      id: "light",
      initial: "red",
      states: {
        red: {
          on: {
            GO: {
              actions: assign((context, event) => {
                return {
                  lastAction: "GO",
                };
              }),
              target: "yellow",
            },
          },
        },
        yellow: {
          after: {
            "2000": [
              {
                cond: "isGoing",
                target: "green",
              },
              {
                cond: "isStopping",
                target: "red",
              },
            ],
          },
        },
        green: {
          on: {
            STOP: {
              actions: assign((context, event) => {
                return {
                  lastAction: "STOP",
                };
              }),
              target: "yellow",
            },
          },
        },
      },
    },
    {
      guards: {
        isStopping: (context, event) => context.lastAction === "STOP",
        isGoing: (context, event) => context.lastAction === "GO",
      },
    }
  );

const TrafficLightPage: NextPage = () => {
  const [currentState, send] = useMachine(lightMachine);
  console.log(currentState.value);
  console.log(currentState.context);

  const renderActions = () => {
    return (
      <div>
        {currentState.value === "red" && (
          <button
            onClick={(e) => {
              send({ type: "GO" });
            }}
          >
            Go
          </button>
        )}
        {currentState.value === "green" && (
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
    <p>
      {renderActions()}
      {renderLight(currentState.value)}
    </p>
  );
};

export default TrafficLightPage;
