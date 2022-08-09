import { NextPage } from "next/types";
import { assign, createMachine, StateValue } from "xstate";
import { useMachine } from "@xstate/react";
import Header from "../../uikit/header";

type LightEvent = { type: "GO" } | { type: "ATTENTION" } | { type: "STOP" };
type LightContext = {
  lastAction: "GO" | "STOP";
};
type LightTypestate =
  | { value: "red"; context: LightContext }
  | { value: "yellow"; context: LightContext }
  | { value: "green"; context: LightContext };

const lightMachine =
  /** @xstate-layout N4IgpgJg5mDOIC5QBsCWUAWAXAdAJ0gGIBxAeUVAAcB7WVLVagOwpAA9EBaARgCYB2HAE5+ADgDM4-t24BWAGy9Z42QBoQAT0TdxonNwAs80f15DxQg0asBfG+rSZcGsMmTUA7oTawsAQywwHD8AM0C8AApeAAZYgEpCR2wcFzdPVho6BmZWDgQeAWExSWk5RWU1TS4ZPVFlGQNuaKElGNk7B3RkqAIwJkIAZQAVUgAFDNp6RhYkdmrCkQkpGQUlFXUtBFlufSMTfl1o0SNZdo6QJmoIOFYk3AIICazp3K5ebnkiiV4DXh+P3gbbSyXi7YzyITyWLRAwiAznO4pVzuDxPKY5WZ5GTRHCSRqyfhWUSiaK8CxAhDyQTyPaEmGGWH8IQIrq4HpgPpo7IzUB5Th-QTmQyyAyibhCBTiAQUzgKfSiGkgqySSTEllOLkvTFvbbCcTC0XiyXSqr5cU447RcTRVbRUr8fh2OxAA */
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
