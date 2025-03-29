"use client";

import BookCard from "@/components/BookCard";
import FormInput from "@/components/FormInput";
import { getBookByName, getBooks } from "@/services/book.services";
import { GetBooksResponse } from "@/types/book/response.types";
import { BookQueriesKeysEnum } from "@/types/enum/enum";
import SearchIcon from "@mui/icons-material/Search";
import { Box, Container, Grid2, Pagination, Typography } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useForm } from "react-hook-form";

export default function BookList({
  initialBooks,
  totalPages,
  initalPage
}: {
  initialBooks: GetBooksResponse[];
  totalPages: number;
  initalPage: number;
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeSearchTerm, setActiveSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(initalPage);
  
  const {
    control,
    formState: { errors },
  } = useForm<{ title: string }>({
    defaultValues: { title: "" },
  });

  const { data: book } = useQuery({
    queryKey: [BookQueriesKeysEnum.Book, activeSearchTerm],
    queryFn: () => getBookByName(activeSearchTerm),
    enabled: !!activeSearchTerm,
  });

  const { data: booksPaginate } = useQuery({
    queryKey: [BookQueriesKeysEnum.Book, currentPage],
    queryFn: () => getBooks(currentPage, 6),
    enabled: !!currentPage,
  });

  const handleSearchChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setSearchTerm(event.target.value);
  };

  const handlePageChange = (
    _event: React.ChangeEvent<unknown>,
    page: number
  ) => {
    setCurrentPage(page);
  };

  const handleSearchClick = () => {
    setActiveSearchTerm(searchTerm.trim());
    setCurrentPage(1);
  };

  const displayedBooks = activeSearchTerm
    ? book
      ? [book] // Afficher le livre trouvé par la recherche
      : []
    : booksPaginate?.books?.length
    ? booksPaginate.books // Si la pagination a des livres, on les affiche
    : initialBooks?.filter((b: GetBooksResponse) =>
        b.title.toLowerCase().includes(searchTerm.toLowerCase()) // Filtrer par terme de recherche dans les livres initiaux
      ) || []; // Si pas de pagination, on affiche initialBooks filtré

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
              name="title"
              label="Nom du livre"
              control={control}
              errors={errors}
              required={false}
              onChange={handleSearchChange}
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
        <Grid2 container spacing={4}>
          {displayedBooks && displayedBooks.length > 0 ? (
            displayedBooks.map((book: GetBooksResponse) => (
              <BookCard
                key={book.id}
                id={book.id}
                coverUrl={book.coverUrl}
                title={book.title}
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
        </Grid2>
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
