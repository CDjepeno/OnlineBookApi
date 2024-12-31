import SearchIcon from "@mui/icons-material/Search";
import { Box, Container, Grid, Pagination, Typography } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import FormInput from "../../components/FormInput";
import Loading from "../../components/Loading/Loading";
import { BookQueriesKeysEnum } from "../../enum/enum";
import { getBookByName } from "../../services/book.services";
import BookCard from "../book/components/BookCard";
import HomePageHook from "./HomePage.hook";

export function HomePage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeSearchTerm, setActiveSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [limit] = useState(6);

  const { isPending, books, errors, control, totalPages } = HomePageHook(
    currentPage,
    limit
  );
  console.log(books);
  
  const { data: book } = useQuery({
    queryKey: [BookQueriesKeysEnum.Book, activeSearchTerm],
    queryFn: () => getBookByName(activeSearchTerm),
    enabled: !!activeSearchTerm,
  });

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handlePageChange = (
    _event: React.ChangeEvent<unknown>,
    page: number
  ) => {
    console.log(page);
    
    setCurrentPage(page); 
  };

  const handleSearchClick = () => {
    setActiveSearchTerm(searchTerm.trim());
    setCurrentPage(1);
  };

  const displayedBooks = activeSearchTerm
    ? book
      ? [book]
      : []
    : books?.filter((b) =>
        b.name.toLowerCase().startsWith(searchTerm.toLowerCase())
      ) || [];

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
          <Box sx={{ display: "flex", alignItems: "center", mt: 3 }}>
            <FormInput
              name="name"
              label="Nom du livre"
              control={control}
              errors={errors}
              required={false}
              inputProps={{
                onChange: handleSearchChange,
              }}
            />
            <SearchIcon
              sx={{
                color: "primary.main",
                fontSize: "2rem",
                cursor: "pointer",
                ml: 2,
              }}
              onClick={handleSearchClick}
            />
          </Box>
        </Container>
      </Box>
      <Container sx={{ py: 8 }} maxWidth="md">
        {isPending ? (
          <Loading />
        ) : (
          <Grid container spacing={4}>
            {displayedBooks && displayedBooks.length > 0 ? (
              displayedBooks.map((book) => (
                <BookCard
                  key={book.id}
                  id={book.id}
                  coverUrl={book.coverUrl}
                  name={book.name}
                  author={book.author}
                  description={book.description}
                  releaseAt={book.releaseAt}
                />
              ))
            ) : (
              <Typography align="center" color="text.secondary">
                {activeSearchTerm
                  ? `Aucun livre trouvé pour le terme "${activeSearchTerm}".`
                  : "Aucun livre disponible."}
              </Typography>
            )}
          </Grid>
        )}
      </Container>
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
          count={totalPages}
          page={currentPage}
          onChange={handlePageChange}
          color="primary"
        />
      </Box>
    </main>
  );
}
