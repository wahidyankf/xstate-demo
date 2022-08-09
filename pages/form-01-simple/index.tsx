import { useMachine } from "@xstate/react";
import { NextPage } from "next/types";
import React from "react";
import { assign, createMachine } from "xstate";
import Header from "../../uikit/header";

type FormEvent =
  | { type: "UPDATE_NOTES"; value: string }
  | { type: "UPDATE_USERNAME"; value: string }
  | { type: "UPDATE_PHONE_NUMBER"; value: string }
  | { type: "UPDATE_NOTES"; value: string }
  | { type: "SUBMIT" };
type FormContext = { username: string; phoneNumber: string; notes: string };
type FormTypeState =
  | { value: "initial"; context: FormContext }
  | { value: "filling"; context: FormContext }
  | { value: "submitted"; context: FormContext };

const lightMachine =
  /** @xstate-layout N4IgpgJg5mDOIC5QDMD2AnAtgOgJYDtcAXXAQwBsBiAVQAUARAQQBUBRAfWoGVWAlAOUYBZVolAAHVLGK5U+MSAAeiAIwBmNdgBMAVgAMelQHYALAE4tKgGxqdWgDQgAnqqOa1Bg1b1mjWqwAcJiYAviGOaFh4hCQUNAwsHLQAEgDy-Bz81EIAQnwKktIkcgrKCOqaugbG5pY2do4uCP562B4Gaip6Ad5uJmphERg4BDJxdExs7PypbFwFUjIlSEqqGtr6hqYW1rYOzogmxm2e3TpmViomAWaDIJE4yLjk5ARQ8ZMc3HyCIgtFsnkKzK5iM2C6ZmCQSsRm6MJMjUQGk0ZlRqICmxhxjuD2wTxebw+iXYKXSmWyeV4-yWQNAIOC2BMOk6NmuWiM5w5iPKRjBpy0PjMenOVi0A3C92GeOer3w7wmxJmc2pxVpqwQOnU2CsVhMPihOhhegRBwQN2waNR3i2ZhUWhxUvxsveXGoOSEAElmCrAaVEKYdNrDR5IW5bDoAty1BdsJtDDpzB5zsawhL8KgIHAFLjRrFyD7lnTDvsmiGTgZLEE9JYdLWHVEnW8C2qygmzODdXajL49DrbdyTP5sPy1NdQzCdPWcLAAK4AI0wxCIkGbfvKW21Pjbg5UGJuA6HI7HJiME6nq+Bqkjpt3w9O99ORlTISAA */
  createMachine<FormContext, FormEvent, FormTypeState>(
    {
      context: { username: "", phoneNumber: "", notes: "" },
      id: "form",
      initial: "initial",
      states: {
        initial: {
          on: {
            UPDATE_USERNAME: {
              actions: "updateUsername",
              target: "filling",
            },
            UPDATE_PHONE_NUMBER: {
              actions: "updatePhoneNumber",
              cond: "isPhoneNumberFieldValid",
              target: "filling",
            },
            UPDATE_NOTES: {
              actions: "updateNotes",
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
            UPDATE_PHONE_NUMBER: {
              actions: "updatePhoneNumber",
              cond: "isPhoneNumberFieldValid",
              target: "filling",
              internal: false,
            },
            UPDATE_NOTES: {
              actions: "updateNotes",
              target: "filling",
              internal: false,
            },
            SUBMIT: {
              cond: "isFormDataComplete",
              target: "submitted",
            },
          },
        },
        submitted: {},
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
        updatePhoneNumber: assign((context, event) => {
          if (event.type === "UPDATE_PHONE_NUMBER") {
            return { phoneNumber: event.value };
          }

          return {};
        }),
        updateNotes: assign((_context, event) => {
          if (event.type === "UPDATE_NOTES") {
            return {
              notes: event.value,
            };
          }
          return {};
        }),
      },
      guards: {
        isPhoneNumberFieldValid: (context, event): boolean => {
          function isNumeric(value: string) {
            return /^-?\d+$/.test(value);
          }

          if (event.type === "UPDATE_PHONE_NUMBER") {
            return event.value === "" ? true : isNumeric(event.value);
          } else {
            return false;
          }
        },
        isFormDataComplete: (context, event): boolean => {
          return context.username.length > 0 && context.phoneNumber.length > 0;
        },
      },
    }
  );

const TrafficLightPage: NextPage = () => {
  const [currentState, send] = useMachine(lightMachine);

  let handleSubmit = (e: React.SyntheticEvent) => {
    e.preventDefault();
    send({ type: "SUBMIT" });
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
        <span>Phone Number: </span>
        <input
          type="text"
          value={currentState.context.phoneNumber}
          onChange={(e) => {
            e.preventDefault();
            send({
              type: "UPDATE_PHONE_NUMBER",
              value: e.target.value,
            });
          }}
        />
        <br></br>
        <br></br>
        <span>Notes: </span>
        <input
          type="text"
          value={currentState.context.notes}
          onChange={(e) => {
            e.preventDefault();
            send({
              type: "UPDATE_NOTES",
              value: e.target.value,
            });
          }}
        />
        <br></br>
        <br></br>
        <button onClick={handleSubmit}>Submit</button>
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

export default TrafficLightPage;
