import { NextPage } from "next/types";
import { createMachine } from "xstate";
import { useMachine } from "@xstate/react";

type movement = "START" | "ATTENTION" | "STOP";

const lightMachine =
  /** @xstate-layout N4IgpgJg5mDOIC5QBsCWUAWAXAdAJ0gGIBxAeUVAAcB7WVLVagOwpAA9EBGAVk5wAZBgzgE4AHACZOAZgliANCACeiMSJwjNIgOwSAbNO389AFn7cAvhcVpMuAhEIBBACouAogDkXASVKfWGjoGZlYOBB4+IWFxKVkFZUQJbhMNLRETbRMTbm09CW0rG3RsHCUwZGRqAHdCAGUXUgAFQNp6RhYkdi4RPQFpTgkTCX4Zbn08xRUEEe0BaO49bn59Az0ikFtS8sqaknIuoPbQrvDpEWl+weHpbhFRkymk3JxlwWlZTmMJaT11602JVwUAIYCY9UaLUObRCnVA4RM0jEAnyJkk534Zm0IieCEMqRMWjUEhEnG0AwkGy2wNB4NcHm8fgC0OCHTCiHOl34FJudweuJG6kJmj02k4YmG4p0VgBTGoEDgrGp+EgrVZJ3hiGGuK+-BwahFhIMd1FVKBZQqVWqauOcO6MzUOFF4tMYjE425Im4As4fE4fz+AwM5n4YmkZrsOBBYDBNth7IQKT4RgGiN0YhkyQF-DmYiE+nG904JlMEewcbZpy4CWm4plFiAA */
  createMachine({
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

const DemoPage: NextPage = () => {
  const [currentState, send] = useMachine(lightMachine);
  console.log(currentState);

  const renderActions = () => {
    return (
      <div>
        <button
          onClick={(e) => {
            send({ type: "STOP" });
          }}
        >
          Stop
        </button>
        <button
          onClick={(e) => {
            send({ type: "Attention" });
          }}
        >
          Attention
        </button>
        <button
          onClick={(e) => {
            send({ type: "Stop" });
          }}
        >
          Stop
        </button>
      </div>
    );
  };

  return <p>{renderActions()}</p>;
};

export default DemoPage;
