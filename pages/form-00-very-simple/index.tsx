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
  /** @xstate-layout N4IgpgJg5mDOIC5QDMD2AnAtgOgJYDtcAXXAQwBsBiAVQAUARAQQBUBRAfWoGVWAlAOUYBZVolAAHVLGK5U+MSAAeiAIwBmNdgBMAVgAMelQHYALAE4tKgGxqdWgDQgAnqqOa1Bwyp02fZnQC+AY5oWHiEJBQ0DCwctAASAPL8HPzUQgBCfAqS0iRyCsoI6pq6Bsbmlr4OzohaVnrYHgZaemZqJmpGKiaBwSChOAQyUXRMbOz8iWxcOVIyBUhKqhra+oamFta2NS4IJsZNnlpmVgAcer1qWkEhGDjIuOTkBFDR4xzcfIIic3my8iWRXMRmwKjaByMWjU4IuJkcew0JmwnkMF2hxh8JluA3u2Eez1e71i7ASyVS6SyvD+C0BoGBJmRV22JjOWiMOjMRgRrlBqLa7KMbTUZz6dzCBJe+DeYxJUxmNPydOWCB06mwVisB3B4LUVjcOh5CDOZmwZnNFrMeisJxUZjOOMG+KeUreXGoGSEAElmIqAYVEKYdBqfB4zCY3LYdGcjWpTth1npbIYdKG9EYgv18KgIHAFE7hpFyH7FvTECZdogw0cWm5rWr9Y68ZLXiXlUUdOYwVqVCpoXZNZyjRWrCjjm52lyOU2wrAAK4AI0wxCIkDbAeKGw1EJMBn8Zz1ZmH9THBh2ehORjMKhnmHXQNUMdqxQdmaAA */
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
