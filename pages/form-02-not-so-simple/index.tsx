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
  phoneNumber: string;
  notes: string;
};
type FormTypeState =
  | { value: "initial"; context: FormContext }
  | { value: "filling"; context: FormContext }
  | { value: "submitted"; context: FormContext };

const formMachine =
  /** @xstate-layout N4IgpgJg5mDOIC5QDMD2AnAtgOgJYDtcAXXAQwBsBiAVQAUARAQQBUBRAfWoGVWAlAOUYBZVolAAHVLGK5U+MSAAeiAIwBmNdgBMAVgAMBlQA4A7ABYVANj1qjAGhABPVSc1aAnJ6NbLJvT7UTEwBfYIc0LDxCEgoaBhYOWgAJAHl+Dn5qIQAhPgVJaRI5BWUEdTd9Q1MLa1sHZwQfPW1PTy09Cz1LHW7Q8IwcAhlYuiY2dn4Uti58qRlipCVVDW1KvWNzKxt7J0QLExbPS3cdHRUVCxUdPpAInGRccnICKDixjm4+QRFZwtl5RalMzuA4qPTuQI2IJ6Exgyz1RAaTStTxddxWPwqG53bAPJ4vN4JdjJNIZLK5Xi-eYA0BAsxmbBmHRqC4mIyWMwmHrw3ZlEyWbAokE9NQ6dFmIzYga4x7PfCvUZEybTKlFGlLBBnTSWDkwozs-m+NQIhDuZoGC22MEmdxaflSyJ4uWvLjUbJCACSzFV-xKiHMOmw3UsWhZtg0Zn8JrU7gFwM8-PpRj0WtCYRA+FQEDgChxQxi5B9C1pey00fBh3c3htOnabId91lLyL6tKOmB2CskeB+q6zJ0JrMukFrSM9PHliM7gb2FgAFcAEaYYhESAtv1ldYHawQsyWWxs4xl3lDwMosfjvdThvrwGqHYNYxp4JAA */
  createMachine<FormContext, FormEvent, FormTypeState>(
    {
      context: {
        username: { value: "", status: null },
        phoneNumber: "",
        notes: "",
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
            if (event.value.length >= 6) {
              return {
                username: { value: event.value, status: { kind: "ok" } },
              };
            }
            return {
              username: {
                value: event.value,
                status: { kind: "error", message: "username is too short" },
              },
            };
          }
          return {};
        }),
        updatePhoneNumber: assign((context, event) => {
          if (event.type === "UPDATE_PHONE_NUMBER") {
            return {
              phoneNumber: event.value,
            };
          }

          return {};
        }),
        updateNotes: assign((context, event) => {
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
          return (
            context.username.status?.kind === "ok" &&
            context.phoneNumber.length > 0
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
    let usernameStatus = currentState.context.username.status;

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
        {usernameStatus?.kind === "error" && <p>{usernameStatus?.message}</p>}
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
        <button
          onClick={handleSubmit}
          disabled={currentState.context.username.status?.kind !== "error"}
        >
          Submit
        </button>
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
