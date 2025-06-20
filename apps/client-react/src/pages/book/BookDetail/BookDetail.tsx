import { Box, CircularProgress, Container, Typography } from "@mui/material";
import { getDisplayErrorMessage } from "../../../utils/getDisplayErrorMessage";
import BookCardDetail from "../components/BookDetailCard";
import BookDetailHook from "./BookDetail.hook";

function BookDetail() {
  const { isPending, book, error } = BookDetailHook();

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

  if (!book) {
    return renderCenteredContent(
      <Typography variant="h6">Aucun livre trouvé</Typography>
    );
  }

  return (
    <Container sx={{ py: 8 }}>
      <BookCardDetail
        name={book.title}
        author={book.author}
        description={book.description}
        releaseAt={book.releaseAt}
        coverUrl={book.coverUrl}
      />
    </Container>
  );
}

export default BookDetail;
