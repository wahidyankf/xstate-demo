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
  /** @xstate-layout N4IgpgJg5mDOIC5QDMD2AnAtgOgJYDtcAXXAQwBsBiAVQAUARAQQBUBRAfWoGVWAlAOUYBZVolAAHVLGK5U+MSAAeiAIwBmNdgBMagCwAODQFYA7CoBsABj0AaEAE9VJzVqMBOI5a26TRtVa19AF8guzQsPEISChoGFg5aAAkAeX4OfmohACE+BUlpEjkFZQR1Fz1DNVMLa107RwQtK20VN2c9S3M2k0sTELCMHAIZGLomNnZ+ZLYuPKkZIqQlVQ1tCuMzK1sHRF0VE2wVA31zY-0tFVN+kHCh-FgwdBJ8KFjxjm4+QRE5gtl5JYlXRuczYNxuNQWfRGLSWc6+Ez1RAaTT6EynQzmQzQ3Raa63SIPJ4EV5jeLsJKpdKZHK8X4LAGgIG6XTYPRuC76S46AxaRE7UrosE+NQeXG+I7mfGDQmPZ6kuITKYzemFRnLBBGdTYIzAvzqLHmFQqfRIhD6NxgtGcmE9C7mPqhG4yghE+WULjULJCACSzFV-2KiBMuiM2F05n8XnalghKjNotBVXMWjcrTMaecUuu+FQEDgCgJw2i5ADiyZuy0CdjhzcnRMdZMJhOvSM0oirrlJLL6pKfgOl30hlbRs6RjNuLDmPMViM+l0ejM7ZwsAArgAjTDEIiQHtB0qWfZsqqWTqXMq6ieubCYnoclQ6Odtp23PeA1SmgUm7Cn39--+OiEQA */
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
