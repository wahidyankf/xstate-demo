import { NextPage } from "next/types";
import { createMachine, StateValue } from "xstate";
import { useMachine } from "@xstate/react";

type LightEvent = { type: "GO" } | { type: "ATTENTION" } | { type: "STOP" };
type LightContext = {};
type LightTypestate =
  | { value: "red"; context: LightContext }
  | { value: "yellow"; context: LightContext }
  | { value: "green"; context: LightContext };

const lightMachine =
  /** @xstate-layout N4IgpgJg5mDOIC5QBsCWUAWAXAdAJ0gGIBxAeUVAAcB7WVLVagOwpAA9EBGAVk5wAZBgzgE4AHACZOAZgliANCACeiMSJwjNIgOwSAbNO389AFn7cAvhcVpMuAhEIBBACouAogDkXASVKfWGjoGZlYOBB4+IWFxKVkFZUQJbhMNLRETbRMTbm09CW0rG3RsHCUwZGRqAHdCAGUXUgAFQNp6RhYkdi4RPQFpTgkTCX4Zbn08xRUEEe0BaO49bn59Az0ikFtS8sqaknIuoPbQrvDpEWl+weHpbhFRkymk3JxlwWlZTmMJaT11602JVwUAIYCY9UaLUObRCnVA4RM0jEAnyJkk534Zm0IieCEMqRMWjUEhEnG0AwkGy2wNB4NcHm8fgC0OCHTCiHOl34FJudweuJG6kJmj02k4YmG4p0VgBTGoEDgrGp+EgrVZJ3hiGGuK+-BwahFhIMd1FVKBZQqVWqauOcO6MzUOFF4tMYjE425Im4As4fE4fz+AwM5n4YmkZrsOBBYDBNth7IQKT4RgGiN0YhkyQF-DmYiE+nG904JlMEewcbZpy4CWm4plFiAA */
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
          STOP: {
            target: "red",
          },
          GO: {
            target: "green",
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

  const renderActions = () => {
    return (
      <div>
        <button
          onClick={(e) => {
            send({ type: "GO" });
          }}
        >
          Go
        </button>
        <button
          onClick={(e) => {
            send({ type: "ATTENTION" });
          }}
        >
          Attention
        </button>
        <button
          onClick={(e) => {
            send({ type: "STOP" });
          }}
        >
          Stop
        </button>
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
