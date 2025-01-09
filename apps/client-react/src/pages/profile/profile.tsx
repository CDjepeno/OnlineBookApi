import DeleteTwoToneIcon from "@mui/icons-material/DeleteTwoTone";
import EditTwoToneIcon from "@mui/icons-material/EditTwoTone";
import {
  Box,
  Button,
  Checkbox,
  CircularProgress,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Modal,
  Pagination,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import { useState } from "react";
import UserCard from "src/components/CardUser";
import { BookForm } from "src/types/book/form.types";
import { UserForm } from "src/types/user/form.types";
import { UserFormInput } from "src/types/user/input.types";
import { formatDate } from "../../utils/formatDate";
import BookUpdateForm from "../book/BookForm/BookUpdate/BookUpdateForm";
import { TableList } from "../book/components/TableList";
import UserUpdateForm from "../user/Update-User/UserUpdateForm";
import ProfileHook from "./profile.hook";

export default function Profile() {
  const [isFormUpdateBookOpen, setIsFormUpdateBookOpen] = useState(false);
  const [isFormUpdateUserOpen, setIsFormUpdateUserOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [openBookId, setOpenBookId] = useState<number | null>(null);
  const [selectedBookIds, setSelectedBookIds] = useState<number[]>([]);
  const [isBulkDelete, setIsBulkDelete] = useState(false);

  const limit = 6;

  const {
    books,
    isPending,
    error,
    deleteBookMutation,
    user,
    deleteBooksMutation,
  } = ProfileHook(currentPage, limit);

  const [book, setBook] = useState<BookForm>({
    id: 0,
    title: "",
    description: "",
    author: "",
    releaseAt: "",
    coverUrl: undefined,
  });

  const [userForm, setUserForm] = useState<UserFormInput>({
    id: user?.id || 0,
    email: user?.email || "",
    password: "",
    confirmPassword: "",
    name: user?.name || "",
    phone: user?.phone || "",
    sexe: user?.sexe || "",
  });

  const handleDialogClose = () => {
    setOpenBookId(null); // Ferme la boîte de dialogue
  };

  const handleDialogOpen = (bookId: number) => {
    setOpenBookId(bookId); // Ouvre la boîte de dialogue pour le livre sélectionné
  };

  const DeleteBook = async (id: number) => {
    try {
      await deleteBookMutation(id);
      handleDialogClose();
    } catch (error) {
      console.error("Error deleting book:", error);
    }
  };

  const editBook = (book: BookForm) => {
    setBook(book);
    setIsFormUpdateBookOpen(true);
  };

  const editUser = (user: UserForm) => {
    setUserForm(user);
    setIsFormUpdateUserOpen(true);
  };

  const handlePageChange = (
    _event: React.ChangeEvent<unknown>,
    page: number
  ) => {
    setCurrentPage(page);
  };

  // Suppresion multiple
  // Gestion de la sélection/déselection
  const toggleSelectBook = (id: number) => {
    setSelectedBookIds((prev) =>
      prev.includes(id) ? prev.filter((bookId) => bookId !== id) : [...prev, id]
    );
  };

  // Suppression en masse
  const deleteSelectedBooks = async () => {
    if (selectedBookIds.length === 0) return;

    await deleteBooksMutation(selectedBookIds);
    setSelectedBookIds([]); // Réinitialise la sélection
  };

  const handleBulkDeleteDialogOpen = () => {
    setIsBulkDelete(true);
    setOpenBookId(null); // Pas d'ID spécifique pour une suppression multiple
  };

  const handleBulkDeleteDialogClose = () => {
    setIsBulkDelete(false);
    setOpenBookId(null);
  };

  const deleteBooksConfirmation = async () => {
    try {
      if (isBulkDelete) {
        // Suppression en masse
        await deleteSelectedBooks();
      } else if (openBookId !== null) {
        // Suppression individuelle
        await DeleteBook(openBookId);
      }
      handleBulkDeleteDialogClose();
    } catch (error) {
      console.error("Error during deletion:", error);
    }
  };

  const toggleSelectAllBooks = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      // Sélectionne tous les livres disponibles
      const allSelectableBookIds =
        books
          ?.filter((book) => !book.hasFuturReservations)
          .map((book) => book.id) || [];
      setSelectedBookIds(allSelectableBookIds);
    } else {
      // Désélectionne tous les livres
      setSelectedBookIds([]);
    }
  };

  const isAllSelected =
    books && books.length > 0 &&
    selectedBookIds.length ===
      books!.filter((book) => !book.hasFuturReservations).length;

  const isIndeterminate = selectedBookIds.length > 0 && !isAllSelected;

  const headCells = [
    <Checkbox
      indeterminate={isIndeterminate}
      checked={isAllSelected}
      onChange={toggleSelectAllBooks}
    />,
    "Name",
    "Auteur",
    "Description",
    "Date de parution",
    "Couverture",
    "Actions",
  ];

  const rows =
    books?.map((book) => ({
      cells: [
        <Checkbox
          checked={selectedBookIds.includes(book.id)}
          onChange={() => toggleSelectBook(book.id)}
          disabled={book.hasFuturReservations} // Désactiver si la suppression est impossible
        />,
        book.title,
        book.author,
        book.description,
        formatDate(book.releaseAt),
        <img
          src={book.coverUrl}
          alt="couverture du book"
          style={{ width: "50px", height: "30px", objectFit: "cover" }}
        />,
        <Stack direction="row" justifyContent="start">
          <IconButton aria-label="edit" onClick={() => editBook(book)}>
            <EditTwoToneIcon />
          </IconButton>
          <Tooltip
            title={
              book.hasFuturReservations
                ? "Suppression désactivée pour ce livre"
                : "Supprimer ce livre"
            }
            arrow
            disableInteractive
          >
            <span>
              <IconButton
                onClick={() => handleDialogOpen(book.id)}
                aria-label="delete"
                disabled={book.hasFuturReservations}
              >
                <DeleteTwoToneIcon />
              </IconButton>
            </span>
          </Tooltip>
          <Dialog
            open={isBulkDelete || openBookId !== null}
            onClose={handleBulkDeleteDialogClose}
            aria-labelledby="delete-dialog-title"
            aria-describedby="delete-dialog-description"
          >
            <DialogTitle id="delete-dialog-title">
              Confirmer la suppression
            </DialogTitle>
            <DialogContent>
              <DialogContentText id="delete-dialog-description">
                {isBulkDelete
                  ? `Êtes-vous sûr de vouloir supprimer les ${selectedBookIds.length} livres sélectionnés ? Cette action est irréversible.`
                  : `Êtes-vous sûr de vouloir supprimer ${book.title} ? Cette action est irréversible.`}
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleBulkDeleteDialogClose} color="primary">
                Annuler
              </Button>
              <Button onClick={deleteBooksConfirmation} color="error" autoFocus>
                Supprimer
              </Button>
            </DialogActions>
          </Dialog>
        </Stack>,
      ],
    })) || [];

  if (isPending && !user) {
    return (
      <Container>
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          minHeight="100vh"
        >
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          minHeight="100vh"
        >
          <Typography variant="h6" color="error">
            {error.message || "Error loading books user"}
          </Typography>
        </Box>
      </Container>
    );
  }

  if (!books || (books.length === 0 && !user)) {
    return (
      <Container>
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          minHeight="100vh"
        >
          <Typography variant="h6">No books user found</Typography>
        </Box>
      </Container>
    );
  }
  if (!userForm) {
    return (
      <Container>
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          minHeight="100vh"
        >
          <Typography variant="h6">No user found</Typography>
        </Box>
      </Container>
    );
  }

  return (
    <Container sx={{ py: 8 }} maxWidth="lg">
      <UserCard
        sexe={user?.sexe}
        email={user?.email}
        phone={user?.phone}
        name={user?.name}
        action={
          <IconButton aria-label="edit" onClick={() => editUser(userForm)}>
            <EditTwoToneIcon />
          </IconButton>
        }
      />
      <Typography
        component="h1"
        variant="h5"
        mb="30px"
        sx={{ color: "primary.main" }}
      >
        Livre de {user?.name}
      </Typography>
      <div>
        <Button
          onClick={handleBulkDeleteDialogOpen}
          color="error"
          variant="contained"
          disabled={selectedBookIds.length === 0} // Désactiver si aucune sélection
        >
          Supprimer les livres sélectionnés
        </Button>
      </div>
      <TableList headCells={headCells} rows={rows} />
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          mt: 1,
          backgroundColor: "background.default",
          padding: 1,
          borderRadius: "8px",
        }}
      >
        <Pagination
          count={2}
          page={currentPage}
          onChange={handlePageChange}
          color="primary"
        />
      </Box>
      <Modal
        open={isFormUpdateUserOpen}
        onClose={() => setIsFormUpdateUserOpen(false)}
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
          <UserUpdateForm
            userUpdate={userForm}
            setIsFormUpdateUserOpen={setIsFormUpdateUserOpen}
          />
        </Box>
      </Modal>
      <Modal
        open={isFormUpdateBookOpen}
        onClose={() => setIsFormUpdateBookOpen(false)}
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
          <BookUpdateForm
            bookUpdate={book}
            setIsFormUpdateBookOpen={setIsFormUpdateBookOpen}
          />
        </Box>
      </Modal>
    </Container>
  );
}
