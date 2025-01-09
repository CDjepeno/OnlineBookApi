import {
  Box,
  Card,
  CardContent,
  CardMedia,
  CircularProgress,
  Container,
  Grid,
  Typography,
} from "@mui/material";
import { DateRange } from "@mui/x-date-pickers-pro/models";
import dayjs, { Dayjs } from "dayjs";
import { useContext, useState } from "react";
import CalendarGeneric from "src/components/CalendarGenericForm";
import { AuthContext } from "../../../context";
import { AuthContextValue } from "../../../interfaces/auth.context.value";
import { formatDate } from "../../../utils/formatDate";
import { truncateDescription } from "../../../utils/truncateText";
import BookDetailHook from "./BookDetail.hook";

function BookDetail() {
  const [dateRange, setDateRange] = useState<DateRange<Dayjs>>([null, null]);
  const { user } = useContext(AuthContext) as AuthContextValue;

  const { isPending, book, error, bookingsBook, onSubmit } = BookDetailHook();

  const bookings = bookingsBook?.map((reservation) => ({
    startAt: dayjs(reservation.startAt),
    endAt: dayjs(reservation.endAt),
  }));

  const shouldDisableDate = (date: Dayjs) => {
    if (!bookings) {
      return false;
    }

    return bookings?.some((booking) => {
      const startAt = dayjs(booking.startAt);
      const endAt = dayjs(booking.endAt);

      const isSameOrAfter =
        date.isSame(startAt, "day") || date.isAfter(startAt, "day");
      const isSameOrBefore =
        date.isSame(endAt, "day") || date.isBefore(endAt, "day");

      return isSameOrAfter && isSameOrBefore;
    });
  };

  const handleclick = () => {
    const [startAt, endAt] = dateRange.map((date) =>
      dayjs(date).format("YYYY-MM-DD")
    );
    const inputForm = {
      bookId: book!.id,
      userId: user!.id,
      startAt,
      endAt,
    };

    onSubmit({
      ...inputForm,
      name: user!.name,
      title: book!.title,
      email: user!.email,
    });
  };

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
      <Grid item xs={12} sm={12} md={12}>
        <Card
          sx={{
            height: "100%",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <CardMedia
            component="img"
            height="400"
            image={book.coverUrl}
            alt={book.title}
          />
          <CardContent sx={{ flexGrow: 1 }}>
            <Box
              sx={{
                display: "flex",
                flexDirection: "row", // Aligne le contenu sur une ligne
                justifyContent: "space-between", // Espace entre les éléments
                alignItems: "flex-start",
              }}
            >
              <Box
                sx={{
                  width: "40%",
                  height: "40vh",
                  display: "flex",
                  flexDirection: "column",
                  gap: 1,
                  justifyContent: "center", // Centre verticalement
                  textAlign: "center",
                }}
              >
                <Typography
                  gutterBottom
                  variant="h5"
                  component="h2"
                  color="primary"
                >
                  {book.title}
                </Typography>
                <Typography variant="subtitle1" color="text.secondary">
                  {book.author}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Date de parution : {formatDate(book.releaseAt)}
                </Typography>
                <Typography variant="body2" color="text.primary">
                  {truncateDescription(book.description, 100)}
                </Typography>
              </Box>
              <CalendarGeneric
                value={dateRange}
                onChange={(newValue) => setDateRange(newValue)}
                shouldDisableDate={shouldDisableDate}
                onActionClick={handleclick}
                actionLabel="Réserver"
                user={user ? true : false}
              />
            </Box>
          </CardContent>
        </Card>
      </Grid>
    </Container>
  );
}

export default BookDetail;
