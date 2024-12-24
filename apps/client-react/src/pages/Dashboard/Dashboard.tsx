import { Container, Typography } from "@mui/material";
import { useContext } from "react";
import { AuthContext } from "../../context";
import { AuthContextValue } from "../../types/user/auth.context.value";
import DashboardHook from "./Dashboard.hook";
import { formatDate } from "../../utils/formatDate";
import { TableList } from "../book/components/TableList";

export default function Dashboard() {
  const { user } = useContext(AuthContext) as AuthContextValue;

  const { bookingsUser } = DashboardHook();

  const headCells = ["Name", "Couverture", "Date de début", "Date de fin"];

  const rows =
  bookingsUser?.map((bookingUser) => ({
    cells: [
      bookingUser.name,
      <img
        src={bookingUser.coverUrl}
        alt="couverture du book"
        style={{ width: "50px", height: "30px", objectFit: "cover" }}
      />,
      formatDate(bookingUser.startAt),
      formatDate(bookingUser.endAt),
    ],
  })) || [];

  return (
    <Container sx={{ py: 8 }} maxWidth="lg">
      <Typography component="h1" variant="h5" mb="30px">
        Réservation de {user?.name}
      </Typography>
      <TableList headCells={headCells} rows={rows} />
    </Container>
  );
}
