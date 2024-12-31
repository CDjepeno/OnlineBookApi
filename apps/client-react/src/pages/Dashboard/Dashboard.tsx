import { Box, Container, Pagination, Typography } from "@mui/material";
import { useContext, useState } from "react";
import { AuthContext } from "../../context";
import { AuthContextValue } from "../../interfaces/auth.context.value";
import { formatDate } from "../../utils/formatDate";
import { TableList } from "../book/components/TableList";
import DashboardHook from "./Dashboard.hook";

export default function Dashboard() {
  const [currentPage, setCurrentPage] = useState(1);
  const { user } = useContext(AuthContext) as AuthContextValue;
  const limit = 6;
  const { bookingsUser, totalPages } = DashboardHook(currentPage, limit);


  const handlePageChange = (
    _event: React.ChangeEvent<unknown>,
    page: number
  ) => {
    setCurrentPage(page);
  };

  const headCells = ["Name", "Couverture", "Date de début", "Date de fin"];

  const rows =
    bookingsUser?.map((bookingUser) => ({
      cells: [
        bookingUser.name,
        <img
          src={bookingUser.coverUrl}
          alt="couverture du book"
          style={{ width: "90px", height: "60px", objectFit: "cover" }}
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
    </Container>
  );
}
