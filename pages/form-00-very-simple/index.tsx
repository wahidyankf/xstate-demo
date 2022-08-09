import { useMachine } from "@xstate/react";
import { NextPage } from "next/types";
import React from "react";
import { assign, createMachine } from "xstate";
import Header from "../../uikit/header";

type FormEvent = { type: "UPDATE_USERNAME"; value: string };
type FormContext = { username: string };
type FormTypeState =
  | { value: "initial"; context: FormContext }
  | { value: "filling"; context: FormContext };

const formMachine =
  /** @xstate-layout N4IgpgJg5mDOIC5QDMD2AnAtgOgJYDtcAXXAQwBsBiAVQAUARAQQBUBRAfWoGVWAlAOUYBZVolAAHVLGK5U+MSAAeiAIwBmNdgBMAVgAMelQHYALAE4tKgGxqdWgDQgAnqp1ns1q1aNqAHGsMtE3UAXxDHNCxsZFxycgIoGgYWDm4+QREFSWkSOQVlBDUtdxUTPSsdN18rFRVfXUcXBF93Mza2qwNjMxUtMPCQfFQIOAVInAIZCiypGTykJUQTB2dVHw8vK19-LTUbFT0TMIiMHBi4hJmc2XkFgr8VDzMdDR0TFqMDCsbVeuwDAxaPRtPRuKy7Y4gcZXOa3UAFOo-BB1f4AtHovRGfohIA */
  createMachine<FormContext, FormEvent, FormTypeState>(
    {
      context: { username: "" },
      id: "form",
      initial: "initial",
      states: {
        initial: {
          on: {
            UPDATE_USERNAME: {
              actions: "updateUsername",
              target: "filling",
            },
          },
        },
        filling: {
          on: {
            UPDATE_USERNAME: {
              actions: "updateUsername",
              target: "filling",
              internal: false,
            },
          },
        },
      },
    },
    {
      actions: {
        updateUsername: assign((_context, event) => {
          if (event.type === "UPDATE_USERNAME") {
            return {
              username: event.value,
            };
          }
          return {};
        }),
      },
    }
  );

const FormPage: NextPage = () => {
  const [currentState, send] = useMachine(formMachine);

  console.log(currentState.value);
  console.log(currentState.context);

  let handleSubmit = (e: React.SyntheticEvent) => {
    e.preventDefault();
  };

  let renderForm = () => {
    return (
      <form onSubmit={(e) => handleSubmit(e)}>
        <span>Username: </span>
        <input
          type="text"
          value={currentState.context.username}
          onChange={(e) => {
            e.preventDefault();
            send({
              type: "UPDATE_USERNAME",
              value: e.target.value,
            });
          }}
        />
        <br></br>
        <br></br>
      </form>
    );
  };

  let renderSuccessNotification = () => {
    return <p>Submission success!!</p>;
  };

  return (
    <div>
      <Header />
      <br></br>
      <br></br>
      {currentState.value !== "submitted" && renderForm()}
      {currentState.value === "submitted" && renderSuccessNotification()}
    </div>
  );
};

export default FormPage;
