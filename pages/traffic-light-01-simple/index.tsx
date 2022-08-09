import { NextPage } from "next/types";
import { assign, createMachine, StateValue } from "xstate";
import { useMachine } from "@xstate/react";

type LightEvent = { type: "GO" } | { type: "ATTENTION" } | { type: "STOP" };
type LightContext = {};
type LightTypestate =
  | { value: "red"; context: LightContext }
  | { value: "yellow"; context: LightContext }
  | { value: "green"; context: LightContext };

const lightMachine =
  /** @xstate-layout N4IgpgJg5mDOIC5QBsCWUAWAXAdAJ0gGIBxAeUVAAcB7WVLVagOwpAA9EBGAVgAYcAnEIEAOAOydeI7gGYAbHJkAaEAE9EA-r23aATLpliZAmTO4BfcyrSZcBCIQCCAFWcBRAHLOAkqQ+saOgZmVg4EHn5hUQkpWQVlNURdbgAWQWEjbW4eTgFLa3RsHFUwZGRqAHcSciQQQPpGFlqw4xkcXhlOAyMxEU5OFIFuFXUEZLEcQaFM3mzsvKsQGyKSssrCAGVnUgAFANoGkOauATl2zoMRFMUU5M4RpN4zqIkZXRi5BYLbHCgCMCYm22e1q9WCTVAYRSMhE7TkuhSInEpm0MhSDwQhjSfD0AzkfUM0nyS0KuD+YABTlcnh8fn2QUaoUQrXOXUMhP6g2GiTGvAEOBxqN4YjkKR4ROJTGoEDgrGWdkg9MOEPYiFuGLM3Bwkh011u3AEXWJ8uKpXKFSV4KZYxE-LkEiuYmhAgkBgxCN0OFMpl0PDkswUcgsixN5IBlsZxwQqU4ODEHU4ci6ws0Ijk7pSWs+Qk+b3xwu4umNpIjR0hXBEGM4sJ0tbrvAGlksQA */
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
    <p>
      {renderActions()}
      {renderLight(currentState.value)}
    </p>
  );
};

export default TrafficLightPage;
