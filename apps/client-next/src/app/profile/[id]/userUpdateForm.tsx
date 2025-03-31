"use client";
import { fr } from "date-fns/locale";
import { registerLocale } from "react-datepicker";
import { UserFromData } from "@/types/user/input.types";
import UserForm from "@/components/UserForm";
import UserUpdateHook from "./userUpdate.hook";

registerLocale("fr", fr);

type UserUpdateFormProps = {
  userUpdate: UserFromData;
  setIsFormUpdateUserOpen: (value: boolean) => void;
};

function UserUpdateForm({
  userUpdate,
  setIsFormUpdateUserOpen,
}: UserUpdateFormProps) {
  const { onSubmit, deleteUserMutation } = UserUpdateHook(setIsFormUpdateUserOpen);

  return (
    <UserForm
      button="Modifier"
      onSubmit={onSubmit}
      title="Modifier l'utilisateur"
      userUpdate={userUpdate}
      deleteUserMutation={deleteUserMutation}
    />
  );
}

export default UserUpdateForm;
