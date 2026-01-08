import DeleteTwoToneIcon from "@mui/icons-material/DeleteTwoTone";
import EditTwoToneIcon from "@mui/icons-material/EditTwoTone";
import MenuBookIcon from "@mui/icons-material/MenuBook";

import {
  Box,
  Button,
  CircularProgress,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Modal,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import { useCallback, useContext, useState } from "react";
import { NavLink } from "react-router-dom";
import { AuthContext } from "../../../context";
import { BOOKINGS_BY_USER_ROUTE } from "../../../request/route-http/route-http";
import { UpdateBookFormType } from "../../../types/book/book.types";
import { AuthContextType } from "../../../types/user/auth.context.type";
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
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [bookToDelete, setBookToDelete] = useState<{
    id: string;
    title: string;
  } | null>(null);
  const [selectedBookId, setSelectedBookId] = useState<string | null>(null);
  const { user } = useContext(AuthContext) as AuthContextType;

  const { books, isPending, error } = BookListUserHook();
  const { deleteBookMutation } = DeleteBookUserHook();

  const confirmDeleteBook = useCallback(
    (book: { id: string; title: string }) => {
      if (document.activeElement && "blur" in document.activeElement) {
        (document.activeElement as HTMLElement).blur();
      }

      setBookToDelete(book);
      setDeleteDialogOpen(true);
    },
    []
  );

  const handleDeleteConfirm = useCallback(async () => {
    if (bookToDelete) {
      try {
        await deleteBookMutation(bookToDelete.id);
        setDeleteDialogOpen(false);
        setBookToDelete(null);

        if (document.activeElement && "blur" in document.activeElement) {
          (document.activeElement as HTMLElement).blur();
        }
      } catch (error) {
        console.error("Error deleting book:", error);
      }
    }
  }, [deleteBookMutation, bookToDelete]);

  const handleDeleteCancel = useCallback(() => {
    setDeleteDialogOpen(false);
    setBookToDelete(null);
  }, []);

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
    books?.map((book) => {
      const hasReservations = String(book.hasFutureReservations) === "1";

      const deleteTooltipMessage = hasReservations
        ? "Suppression désactivée pour ce livre"
        : `Supprimer le livre ${book.title}`;

      return {
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
          <Stack
            key={`actions-${book.id}`}
            direction="row"
            justifyContent="end"
          >
            <IconButton
              onClick={() => editBook(book)}
              aria-label={`Modifier le livre ${book.title}`}
              size="small"
            >
              <EditTwoToneIcon />
            </IconButton>
            <Tooltip title={deleteTooltipMessage} arrow>
              <span>
                <IconButton
                  onClick={() =>
                    !hasReservations &&
                    confirmDeleteBook({ id: book.id, title: book.title })
                  }
                  aria-label={`Supprimer le livre ${book.title}`}
                  size="small"
                  color="error"
                  disabled={hasReservations}
                  sx={{
                    opacity: hasReservations ? 0.4 : 1,
                    cursor: hasReservations ? "not-allowed" : "pointer",
                  }}
                  title={
                    hasReservations
                      ? "Ce livre ne peut pas être supprimé car il a des réservations à venir"
                      : ""
                  }
                >
                  <DeleteTwoToneIcon />
                </IconButton>
              </span>
            </Tooltip>
          </Stack>,
        ],
      };
    }) || [];

  if (isPending) {
    return renderCenteredContent(<CircularProgress />);
  }

  if (error) {
    return renderCenteredContent(
      <Typography variant="h6" color="error">
        {getDisplayErrorMessage(error)}
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
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
      >
        <Box display="flex" alignItems="center">
          <MenuBookIcon sx={{ mr: 2, color: "primary.main" }} />
          <Typography component="h1" variant="h5">
            Mes livres ({books.length})
          </Typography>
        </Box>
        <NavLink
          to={`${BOOKINGS_BY_USER_ROUTE}/${user?.id}`}
          style={{ textDecoration: "none", color: "inherit" }}
        >
          <Button variant="contained" color="primary">
            Réservation
          </Button>
        </NavLink>
      </Box>
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

      <Dialog
        open={deleteDialogOpen}
        onClose={handleDeleteCancel}
        aria-labelledby="delete-dialog-title"
        aria-describedby="delete-dialog-description"
        disableRestoreFocus={true}
      >
        <DialogTitle id="delete-dialog-title">
          Confirmer la suppression
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="delete-dialog-description">
            Êtes-vous sûr de vouloir supprimer le livre "{bookToDelete?.title}"
            ? Cette action est irréversible.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel} color="primary">
            Non
          </Button>
          <Button onClick={handleDeleteConfirm} color="error" autoFocus>
            Oui
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
