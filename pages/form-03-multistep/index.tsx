import { useMachine } from "@xstate/react";
import { NextPage } from "next/types";
import React from "react";
import { assign, createMachine } from "xstate";
import Header from "../../uikit/header";

type status = { kind: "ok" } | { kind: "error"; message: string } | null;

const formMachine =
  /** @xstate-layout N4IgpgJg5mDOIC5QDMD2AnAtgOgJYDtcAXXAQwBsBiAIQFEBxASQDkB9AMUYBkuX7FQAB1SxiuVPgEgAHogCMAZgXYATAFYADFoCc6gCxqF2jQHYANCACeibWux7tj7Qb0A2ba4VrXAXx8W0LGxkXHJyAihsWCIwQQB5fDBKAFUABQARAEEAFVpWZIBlWgAlZkyAWVopYVESCSlZBAAOcytENSa7OVcevTk9FSMVQb8AjBwQsIiomPjEyk5mRgKACVYC3NTWOOYqpBAasXr9xpUmlWwm41dBjQUTEw0bi2sEVw0L7p7XEwGTQ20oxAgQmoXC+Ei0Vi2QA7qgUhkcnlUisdnlmMlynRitUREdJCdEA4NJc5OoPioTAoVNomgoXu0VHpsFotHIPA81GdfP5geNgmDplDBLD4WksrlWMw4rkCrjauICaBGt4SR8FHovAomnS1No5AyEJrXNgnI5Bk4NHo9ECQQKphCZtC4QsWMs1htaFtsgB1OLy-ENRDnEwsuTebxNAyGBSuQ3uOTYTRaYZydm0zx+Xn4VAQOBSO0EMQUAN1JUyIkqQ1XU1m37fDXnW38ybgyGzBJgUuKoMIMmhqP3NSGSm2EyU+MPbBfHotDThtwKZtBVtC2ai7vHZXtTrT8l3cODOnxpom1kU42uNQmZegh1QTflxqeQ2x5lm5zaJQqdw8sZBWAAFcACNMGIGIIEfXtr0NOQNC5acekeYxjHZJpbygwk+yaWD0KzIA */
  createMachine(
    {
      context: {
        username: { value: "", status: null },
        phoneNumber: "",
        notes: "",
      },
      schema: {
        context: {} as {
          username: { value: string; status: status };
          phoneNumber: string;
          notes: string;
        },
        events: {} as
          | { type: "BEGIN_FILLING" }
          | { type: "UPDATE_USERNAME"; value: string }
          | { type: "UPDATE_PHONE_NUMBER"; value: string }
          | { type: "UPDATE_NOTES"; value: string }
          | { type: "FINISH_STEP_ONE" }
          | { type: "FINISH_STEP_TWO" },
      },
      id: "form",
      initial: "initial",
      states: {
        initial: {
          on: {
            BEGIN_FILLING: {
              target: "filling",
            },
          },
        },
        filling: {
          initial: "stepOne",
          states: {
            stepOne: {
              on: {
                UPDATE_USERNAME: {
                  actions: "updateUsername",
                  target: "stepOne",
                  internal: false,
                },
                FINISH_STEP_ONE: [
                  {
                    actions: "updateUsername",
                    target: "stepTwo",
                  },
                  {
                    target: "stepOne",
                    internal: false,
                  },
                ],
              },
            },
            stepTwo: {
              on: {
                UPDATE_PHONE_NUMBER: {
                  actions: "updatePhoneNumber",
                  cond: "isPhoneNumberFieldValid",
                  target: "stepTwo",
                  internal: false,
                },
                UPDATE_NOTES: {
                  actions: "updateNotes",
                  target: "stepTwo",
                  internal: false,
                },
                FINISH_STEP_TWO: {
                  target: "#form.submitted",
                },
              },
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
                username: {
                  value: event.value,
                  status: { kind: "ok" } as status,
                },
              };
            } else {
              return {
                username: {
                  value: event.value,
                  status: {
                    kind: "error",
                    message: "username is too short",
                  } as status,
                },
              };
            }
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
      guards: {},
    }
  );

const FormPage: NextPage = () => {
  const [currentState, send] = useMachine(formMachine);

  let handleSubmit = (e: React.SyntheticEvent) => {
    e.preventDefault();
    // send({ type: "SUBMIT" });
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
