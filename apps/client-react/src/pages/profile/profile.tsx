import DeleteTwoToneIcon from "@mui/icons-material/DeleteTwoTone";
import EditTwoToneIcon from "@mui/icons-material/EditTwoTone";
import {
  Box,
  CircularProgress,
  Container,
  IconButton,
  Modal,
  Pagination,
  Stack,
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

const headCells = [
  "Name",
  "Auteur",
  "Description",
  "Date de parution",
  "Couverture",
  "Actions",
];

export default function Profile() {
  const [isFormUpdateBookOpen, setIsFormUpdateBookOpen] = useState(false);
  const [isFormUpdateUserOpen, setIsFormUpdateUserOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 6;
  const { books, isPending, error, deleteBookMutation, user } = ProfileHook(
    currentPage,
    limit
  );

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

  const DeleteBook = async (id: number) => {
    try {
      await deleteBookMutation(id);
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

  const rows =
    books?.map((book) => ({
      cells: [
        book.title,
        book.author,
        book.description,
        formatDate(book.releaseAt),
        <img
          src={book.coverUrl}
          alt="couverture du book"
          style={{ width: "50px", height: "30px", objectFit: "cover" }}
        />,
        <Stack direction="row" justifyContent="end">
          <IconButton aria-label="edit" onClick={() => editBook(book)}>
            <EditTwoToneIcon />
          </IconButton>
          <IconButton onClick={() => DeleteBook(book.id)} aria-label="delete">
            <DeleteTwoToneIcon />
          </IconButton>
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
