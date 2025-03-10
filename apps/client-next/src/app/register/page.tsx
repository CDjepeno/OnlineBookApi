"use client";

import { useState } from "react";
import RegisterHook from "./register.hook";
import UserForm from "@/components/UserForm";
export default function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const {
    onSubmit,
  } = RegisterHook();

  return (
    <UserForm
      button="Enregistrer"
      onSubmit={onSubmit}
      setShowConfirmPassword={setShowConfirmPassword}
      showPassword={showPassword}
      setShowPassword={setShowPassword}
      showConfirmPassword={showConfirmPassword}
      title="Inscription"
    />
  );
}
