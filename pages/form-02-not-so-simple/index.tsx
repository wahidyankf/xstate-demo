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

type status = { kind: "ok" } | { kind: "error"; message: string } | null;

type FormContext = {
  username: { value: string; status: status };
  phoneNumber: { value: string; status: status };
  notes: { value: string; status: status };
};
type FormTypeState =
  | { value: "initial"; context: FormContext }
  | { value: "filling"; context: FormContext }
  | { value: "submitted"; context: FormContext };

const formMachine =
  /** @xstate-layout N4IgpgJg5mDOIC5QDMD2AnAtgOgJYDtcAXXAQwBsBiAVQAUARAQQBUBRAfWoGVWAlAOUYBZVolAAHVLGK5U+MSAAeiAIwBmNdgBMAVgAMelQHYALAE4tKgGxqdWgDQgAnqqOa1BvSdsAOL0asAX0DHNCw8QhIKGgYWDloACQB5fg5+aiEAIT4FSWkSOQVlBHVNXQNjc0sbO0cXBC0rPWwPAysfHSsLHxVg0IwcAhlouiY2dn4kti5cqRlCpCVVDW19Q1MLa1sHZ0QTYxbPEyajM1srHT6QMJxkXHJyAigYsY5uPkERWfzZeUXi8xGbAqPRmEwmHzHIx6HxWUx1RAaTRmFEojptIzGK43bB3B5PF5xdiJFJpDLZXjfeZ-UAA8HYEw6NRbCFaIw6Mw+BElIxAzx6LSgsx6DlWLRqbEDXH3R74Z6jImTaZUgo0pYIHTqbBWKwmUHgjpwrzcnxmbColFNdZmFRaSXhPGy55caiZIQASWYKt+RUQph02s6HjBblsHO5ajMVmway8cK0woujOCIRA+FQEDgChxQyi5G9C1pex29WDhwMHLU4pM4qxqZxjqeBbVxR05mButtp2hOpt3Jr0f51dNJgC7PtOFgAFcAEaYYhESDN30ldba0FtsGWDpmfuNbBDtQQkNwy71gbL-6qLm7Eo+A-8x-8owpwJAA */
  createMachine<FormContext, FormEvent, FormTypeState>(
    {
      context: {
        username: { value: "", status: null },
        phoneNumber: { value: "", status: null },
        notes: { value: "", status: null },
      },
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
              username: { value: event.value, status: { kind: "ok" } },
            };
          }
          return {};
        }),
        updatePhoneNumber: assign((context, event) => {
          if (event.type === "UPDATE_PHONE_NUMBER") {
            return {
              phoneNumber: { value: event.value, status: { kind: "ok" } },
            };
          }

          return {};
        }),
        updateNotes: assign((context, event) => {
          if (event.type === "UPDATE_NOTES") {
            return {
              notes: { value: event.value, status: { kind: "ok" } },
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
          return (
            context.username.value.length > 0 &&
            context.phoneNumber.value.length > 0
          );
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
          value={currentState.context.username.value}
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
          value={currentState.context.phoneNumber.value}
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
          value={currentState.context.notes.value}
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
