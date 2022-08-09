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
  | { value: "inserting"; context: FormContext }
  | { value: "submitted"; context: FormContext };

const formMachine =
  /** @xstate-layout N4IgpgJg5mDOIC5QDMD2AnAtgOgJYDtcAXXAQwBsBiAVQAUARAQQBUBRAfWoGVWAlAOUYBZVolAAHVLGK5U+MSAAeiAIwBmNdgBMagCwB2ABy6AnLrUBWEypNqANCACeq-Zq1WL+gAxeVurQBspvoAviEOaFh4hCQUNAwsHLQAEgDy-Bz81EIAQnwKktIkcgrKCOpuekam5lY29k6IgV7aNoY+ZhaGhiqh4SCROAQycXRMbOz8qWxcBVIyJUhKqhraVcZmlta2Ds4Iur3Yft2GJlpeWpcqgWERGEP4sGDoJPhQ8eMc3HyCInNFsnkSzKpgC2BMtj8ARMXkMaiMu0QGk0hn0QQsAUxhi0Zy0twG92iTxeBHeY0S7BS6Uy2TyvH+CyBoBBul02D01mhFi05jUAUMiPKaPBBj5xhUNm5AQs+MGROerzJCQmUxmDOKTOWCAs6mwFhq2P0ui8AR8DT2p3BqJsKh1fisaNlhIIxMVlC41ByQgAksx1YDSogjRZsLoApZ9SovBZYSoAoK1CYwZYAlpDNL+e1dIYwv18KgIHAFHLhrFyP7FszEP4E14TEcYfp3D5zLaTE6oi6FaSK5qyhZ4UcukYtNd2mYTIL-CG4ZiNBjUYYY2oOzhYABXABGmGIREgvcD5V8+nZHL8OOMPMnjX27mws-5o6T+iTYdXB+BqgFN5UOdzQA */
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
          // disabled={currentState.context.username.status?.kind !== "error"}
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
