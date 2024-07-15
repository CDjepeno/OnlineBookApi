import { Box, CircularProgress, Container, Typography } from "@mui/material";
import BookCardDetail from "../components/BookDetailCard";
import BookDetailHook from "./BookDetail.hook";

function BookDetail() {
  const { isPending, book, error } = BookDetailHook();
  if (isPending) {
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
            Error loading book details
          </Typography>
        </Box>
      </Container>
    );
  }

  if (!book) {
    return (
      <Container>
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          minHeight="100vh"
        >
          <Typography variant="h6">No book found</Typography>
        </Box>
      </Container>
    );
  }

  return (
    <Container sx={{ py: 8 }}>
      <BookCardDetail
        name={book.name}
        author={book.author}
        description={book.description}
        releaseAt={book.releaseAt}
        coverUrl={book.coverUrl}
      />
    </Container>
  );
}

export default BookDetail;
