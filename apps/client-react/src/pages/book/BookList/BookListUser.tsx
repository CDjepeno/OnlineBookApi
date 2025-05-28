import DeleteTwoToneIcon from "@mui/icons-material/DeleteTwoTone";
import EditTwoToneIcon from "@mui/icons-material/EditTwoTone";
import {
  Box,
  CircularProgress,
  Container,
  IconButton,
  Modal,
  Stack,
  Typography,
} from "@mui/material";
import { useCallback, useContext, useState } from "react";
import { AuthContext } from "../../../context";
import { UpdateBookFormType } from "../../../types/book/book.types";
import { AuthContextValue } from "../../../types/user/auth.context.value";
import { formatDate } from "../../../utils/formatDate";
import { getDisplayErrorMessage } from "../../../utils/getDisplayErrorMessage";
import BookUpdateForm from "../BookForm/BookUpdate/BookUpdateForm";
import { TableList } from "../components/TableList";
import DeleteBookUserHook from "../Delete-book-user-hook";
import BookListUserHook from "./BookListUser.hook";

const headCells = [
  "Name",
  "Auteur",
  "Description",
  "Date de parution",
  "Couverture",
  "Actions",
];

export default function BookListUser() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedBookId, setSelectedBookId] = useState<string | null>(null);
  const { user } = useContext(AuthContext) as AuthContextValue;

  const { books, isPending, error } = BookListUserHook();
  const { deleteBookMutation } = DeleteBookUserHook();

  const deleteBook = useCallback(
    async (id: string) => {
      try {
        await deleteBookMutation(id);
      } catch (error) {
        console.error("Error deleting book:", error);
      }
    },
    [deleteBookMutation]
  );

  const editBook = useCallback((book: UpdateBookFormType) => {
    setSelectedBookId(book.id || null);
    setIsFormOpen(true);
  }, []);

  const handleCloseModale = useCallback(() => {
    setIsFormOpen(false);
    setSelectedBookId(null);
  }, []);

  const bookToUpdate =
    books?.find((book) => book.id === selectedBookId) || null;

  const renderCenteredContent = (content: React.ReactNode) => (
    <Container>
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
      >
        {content}
      </Box>
    </Container>
  );

  const rows =
    books?.map((book) => ({
      cells: [
        book.title,
        book.author,
        book.description,
        formatDate(book.releaseAt),
        <img
          key={`cover-${book.id}`}
          src={book.coverUrl}
          alt={`Couverture du livre ${book.title}`}
          style={{ width: "50px", height: "30px", objectFit: "cover" }}
        />,
        <Stack key={`actions-${book.id}`} direction="row" justifyContent="end">
          <IconButton
            onClick={() => editBook(book)}
            aria-label={`Modifier le livre ${book.title}`}
            size="small"
          >
            <EditTwoToneIcon />
          </IconButton>
          <IconButton
            onClick={() => deleteBook(book.id)}
            aria-label={`Supprimer le livre ${book.title}`}
            size="small"
            color="error"
          >
            <DeleteTwoToneIcon />
          </IconButton>
        </Stack>,
      ],
    })) || [];

  if (isPending) {
    return renderCenteredContent(<CircularProgress />);
  }

  if (error) {
    return renderCenteredContent(
      <Typography variant="h6" color="error">
        // {getDisplayErrorMessage(error)}
        //{" "}
      </Typography>
    );
  }

  if (!books || books.length === 0) {
    return renderCenteredContent(
      <Typography variant="h6">Aucun livre trouvé.</Typography>
    );
  }

  return (
    <Container sx={{ py: 8 }} maxWidth="lg">
      <Typography component="h1" variant="h5" mb="30px">
        Livres de {user?.name}
      </Typography>
      <TableList headCells={headCells} rows={rows} />

      <Modal
        open={isFormOpen}
        onClose={handleCloseModale}
        aria-labelledby="model-book-update-title"
        aria-describedby="model-book-update-description"
      >
        <Box
          sx={{
            p: 4,
            backgroundColor: "white",
            margin: "auto",
            mt: 25,
            width: "35%",
            borderRadius: 2,
            boxShadow: 24,
          }}
        >
          {selectedBookId && bookToUpdate ? (
            <BookUpdateForm
              bookUpdate={bookToUpdate}
              onClose={handleCloseModale}
            />
          ) : (
            <Typography>Erreur : Livre non trouvé</Typography>
          )}
        </Box>
      </Modal>
    </Container>
  );
}
