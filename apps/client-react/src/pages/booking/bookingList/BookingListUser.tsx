import { Box, CircularProgress, Container, Typography } from "@mui/material";
import { useContext } from "react";
import { AuthContext } from "../../../context";
import { TableList } from "../../../pages/book/components/TableList";
import { AuthContextType } from "../../../types/user/auth.context.type";
import { formatDate } from "../../../utils/formatDate";
import BookingListUserHook from "./BookingListUserHook";

const headCells = ["Titre", "Couverture", "Date de début", "Date de fin"];

export default function BookingListUser() {
  const { user } = useContext(AuthContext) as AuthContextType;
  const { bookings, isPending, error } = BookingListUserHook();

  const renderCenteredContent = (content: React.ReactNode) => {
    return (
      <Container>
        <Box
          display="flex"
          justifyContent="center"
          alignItems="conter"
          minHeight="100vh"
        >
          {content}
        </Box>
      </Container>
    );
  };

  if (isPending) {
    return renderCenteredContent(<CircularProgress />);
  }

  if (error) {
    return renderCenteredContent(
      <Typography variant="h6" color="error">
        Erreur lors du chargement des réservations.
      </Typography>
    );
  }

  if (!bookings || bookings.length === 0) {
    return renderCenteredContent(
      <Typography variant="h6">Aucune réservation trouvée.</Typography>
    );
  }

  const rows =
    bookings.map((booking) => ({
      cells: [
        booking.title,
        <img
          key={`cover-${booking.bookId}`}
          src={booking.coverUrl}
          alt={`Couverture du livre ${booking.title}`}
          style={{ width: "50px", height: "30px", objectFit: "cover" }}
        />,
        formatDate(booking.startAt),
        formatDate(booking.endAt),
      ],
    })) || [];

  return (
    <Container sx={{ py: 8 }} maxWidth="lg">
      <Typography component="h1" variant="h5" mb="30px">
        Réservation de{" "}
        {user?.name &&
          user.name.charAt(0).toUpperCase() +
            user.name.slice(1).toLocaleLowerCase()}
      </Typography>
      <TableList headCells={headCells} rows={rows} />
    </Container>
  );
}
