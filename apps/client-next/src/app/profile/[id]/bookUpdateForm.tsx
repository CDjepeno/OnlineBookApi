'use client'
import { fr } from "date-fns/locale";
import { registerLocale } from "react-datepicker";
import { BookFormData } from "@/types/book/form.types";
import BookForm from "@/components/BookForm";
import BookUpdateHook from "./bookUpdate.hook";

registerLocale("fr", fr);


type BookUpdateFormProps = {
  bookUpdate: BookFormData;
  setIsFormUpdateBookOpen: (value: boolean) => void;
};

function BookUpdateForm({
  bookUpdate,
  setIsFormUpdateBookOpen,
}: BookUpdateFormProps) {

  const { onSubmit } = BookUpdateHook(setIsFormUpdateBookOpen);

  return (
    <BookForm button="Modifier" onSubmit={onSubmit} title="Modifier le livre" bookUpdate={bookUpdate} />
   
  );
}

export default BookUpdateForm;
