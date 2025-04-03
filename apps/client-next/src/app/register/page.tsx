"use client";

import RegisterHook from "./register.hook";
import UserForm from "@/components/UserForm";
export default function Register() {

  const {
    onSubmit,
    callbackGoogle
  } = RegisterHook();

  return (
    <UserForm
      button="Enregistrer"
      onSubmit={onSubmit}
      title="Inscription"
      googleCallback={callbackGoogle}
    />
  );
}
