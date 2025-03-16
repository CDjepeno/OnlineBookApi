import { Box, Container, Grid, Typography } from "@mui/material";
import Loading from "../../components/Loading/Loading";
import BookCard from "../book/components/BookCard";
import HomePageHook from "./HomePage.hook";

export function HomePage() {
  const { isPending, books } = HomePageHook();

  return (
    <main>
      <Box sx={{ bgcolor: "background.paper", pt: 8, pb: 6 }}>
        <Container maxWidth="sm">
          <Typography
            component="h1"
            variant="h2"
            align="center"
            color="text.primary"
            gutterBottom
          >
            OnlineBook
          </Typography>
          <Typography variant="h5" align="center" color="text.secondary">
            Bienvenue sur OnlineBook, le numéro 1 de la bibliothèque en ligne de
            livres libres de droits.
          </Typography>
        </Container>
      </Box>
      <Container sx={{ py: 8 }} maxWidth="md">
        {isPending ? (
          <Loading />
        ) : (
          <Grid container spacing={4}>
            {books &&
              books?.map((book) => (
                <BookCard
                  key={book.id}
                  id={book.id}
                  coverUrl={book.coverUrl}
                  name={book.title}
                  author={book.author}
                  description={book.description}
                  releaseAt={book.releaseAt}
                />
              ))}
          </Grid>
        )}
      </Container>
    </main>
  );
}
