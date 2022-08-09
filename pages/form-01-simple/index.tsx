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
  | { value: "inserting"; context: FormContext }
  | { value: "submitted"; context: FormContext };

const formMachine =
  /** @xstate-layout N4IgpgJg5mDOIC5QDMD2AnAtgOgJYDtcAXXAQwBsBiAVQAUARAQQBUBRAfWoGVWAlAOUYBZVolAAHVLGK5U+MSAAeiAIwBmNdgBMAVgAMBlQA4A7ABYVANj1qjAGhABPVSc1aAnJ-dnbak5es1AF8ghzQsPEISChoGFg5aAAkAeX4OfmohACE+BUlpEjkFZQR1N31DUwtA+ydELWttL3cdbx0dAL8QsIwcAhkYuiY2dn5kti48qRkipCVVDW0KvWNzKxta5wQLEybPI3c9V0szHW6QcJxkXHJyAihY4Y5uPkERKYLZeTmSs3ddlR6bwrSzqI6uBxbDSaZptdygkxAs6hC69bDXW73R7xdhJVLpTI5XgfGbfUC-MxmbCnNQqMwmIwnEwdSyQly7AycumWIxArTBFGXdE3O74B5DHFjCYkwpk+YIHTqbABCyAwFqSzHNkIA7YWGePSWDwqTznIUY0UPLjULJCACSzBlX2KiHMOmVHQ8tnaah0WhM2rU8OpXl5vt0fpUIRR+FQEDgCiF-Wi5Cds3JiDMWkDQL2nlOelMarNaIt9zTcpKOj+2CsZkLKkbAVarLq210etDRjUZgOln+JYisAArgAjTDEIiQCsu0orXbWbwmMrGHxqbVZ93NIzd3vwgeC3ozn6qTan6NBIA */
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
              target: "inserting",
            },
            UPDATE_PHONE_NUMBER: {
              actions: "updatePhoneNumber",
              cond: "isPhoneNumberFieldValid",
              target: "inserting",
            },
            UPDATE_NOTES: {
              actions: "updateNotes",
              target: "inserting",
            },
          },
        },
        inserting: {
          on: {
            UPDATE_USERNAME: {
              actions: "updateUsername",
              target: "inserting",
              internal: false,
            },
            UPDATE_PHONE_NUMBER: {
              actions: "updatePhoneNumber",
              cond: "isPhoneNumberFieldValid",
              target: "inserting",
              internal: false,
            },
            UPDATE_NOTES: {
              actions: "updateNotes",
              target: "inserting",
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

const FormPage: NextPage = () => {
  const [currentState, send] = useMachine(formMachine);

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

export default FormPage;
