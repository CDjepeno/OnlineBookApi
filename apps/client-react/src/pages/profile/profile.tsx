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
import { useContext, useState } from "react";
import UserCard from "src/components/CardUser";
import { UpdateBookFormType } from "src/types/book/book.types";
import { AuthContext } from "../../context";
import { AuthContextValue } from "../../types/user/auth.context.value";
import { formatDate } from "../../utils/formatDate";
import BookUpdateForm from "../book/BookForm/BookUpdate/BookUpdateForm";
import { TableList } from "../book/components/TableList";
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
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [book, setBook] = useState<UpdateBookFormType>({
    id: 0,
    name: "",
    description: "",
    author: "",
    releaseAt: "",
    coverUrl: undefined,
  });
  const { user } = useContext(AuthContext) as AuthContextValue;

  const { books, isPending, error, deleteBookMutation } = ProfileHook();

  const DeleteBook = async (id: number) => {
    try {
      await deleteBookMutation(id);
    } catch (error) {
      console.error("Error deleting book:", error);
    }
  };

  const editBook = (book: UpdateBookFormType) => {
    setBook(book);
    setIsFormOpen(true);
  };

  const rows =
    books?.map((book) => ({
      cells: [
        book.name,
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

  if (!books || books.length === 0 && !user) {
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

  return (
    <Container sx={{ py: 8 }} maxWidth="lg">
      <UserCard
          sexe={user?.sexe}
          email={user?.email}
          phone={user?.phone}
          name={user?.name}
        />
      <Typography component="h1" variant="h5" mb="30px">
      </Typography>
      <TableList headCells={headCells} rows={rows} />

      <Modal open={isFormOpen} onClose={() => setIsFormOpen(false)}>
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
          <BookUpdateForm bookUpdate={book} setIsFormOpen={setIsFormOpen} />
        </Box>
      </Modal>
    </Container>
  );
}
