"use client";
import BookAddHook from "./addBook.hook";
import BookForm from "@/components/BookForm";

function BookAddForm() {
  const { onSubmit } = BookAddHook();

  return (
    <BookForm
      button="ajouter"
      title="Ajouter un livre"
      onSubmit={onSubmit}
    />
  );
}

export default BookAddForm;
