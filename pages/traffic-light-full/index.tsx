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
  /** @xstate-layout N4IgpgJg5mDOIC5QBsCWUAWAXAdAJ0gGIBxAeUVAAcB7WVLVagOwpAA9EBGAFk5wE4ArAGZOwgGzDBvAEwAGQQBoQAT0TDuAdhxzdc4Zs4AOcZ3FzuAX0vK0mXCrDJk1AO6E2sLAEMsYHN4AZn54ABTyugCUhHbYOI7Obqw0dAzMrBwIPHxCohJSsgrKaghG-AL8lZUKmvzCMtzC1rbocVAEYEyEAMoAKqQACsm09IwsSOxcvAIiYpLSnPJKqogy5jp6DdxbPNY2IEzUEHCssbgEEMOpYxmIgjIzeZqmcjKcCvzF6qYbupJyZgMf2aIDO8ScLlcV1G6QmmW2whwgk2-DkmiMgJkmi+CCx4iRemRMmk4hkBhBYPaYE60LS41A8JkOM49xw4nZHLk4n47K5FNaWFpNzhXCMzKMvz0Uqlmj2liAA */
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
