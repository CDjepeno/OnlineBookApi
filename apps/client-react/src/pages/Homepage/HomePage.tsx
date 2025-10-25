import SearchIcon from "@mui/icons-material/Search";
import {
  Box,
  Container,
  Grid,
  IconButton,
  InputAdornment,
  Pagination,
  Typography,
} from "@mui/material";
import FormInput from "../../components/FormInput";
import Loading from "../../components/Loading/Loading";
import BookCard from "../book/components/BookCard";
import BookSearchHook from "./Booksearch.hook";
import HomePageHook from "./HomePage.hook";

export function HomePage() {
  const { isPending, books, error, page, setPage } = HomePageHook();

  const {
    control,
    handleSubmit,
    handleSearchClick,
    booksToDisplay,
    isFetching,
  } = BookSearchHook(books?.books);

  if (isPending) return <Loading />;
  if (error)
    return (
      <Typography variant="h6" align="center" color="error">
        Erreur lors du chargement des livres.
      </Typography>
    );

  const totalPages = books?.totalPages ?? 1;

  const handlePageChange = (
    _event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    setPage(value);
  };

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

          <Box
            component="form"
            onSubmit={handleSubmit(handleSearchClick)}
            sx={{ mt: 4, display: "flex", justifyContent: "center" }}
          >
            <FormInput
              name="search"
              label="Rechercher un livre"
              control={control}
              errors={{}}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton type="submit">
                      <SearchIcon color="primary" />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Box>
        </Container>
      </Box>
      <Container sx={{ py: 8 }} maxWidth="md">
        {isFetching ? (
          <Loading />
        ) : booksToDisplay?.length === 0 ? (
          <Typography variant="h6" align="center" color="text.secondary">
            Aucun livre trouvé.
          </Typography>
        ) : (
          <>
            <Grid container spacing={4}>
              {booksToDisplay?.map((book) => (
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
            <Box display="flex" justifyContent="center" mt={4}>
              <Pagination
                count={totalPages}
                page={page}
                onChange={handlePageChange}
                color="primary"
                showFirstButton
                showLastButton
              />
            </Box>
          </>
        )}
      </Container>
    </main>
  );
}
