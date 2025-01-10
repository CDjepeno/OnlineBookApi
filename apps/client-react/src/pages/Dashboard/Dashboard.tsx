import DeleteTwoToneIcon from "@mui/icons-material/DeleteTwoTone";
import EditTwoToneIcon from "@mui/icons-material/EditTwoTone";
import {
  Box,
  Button,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Modal,
  Pagination,
  Tooltip,
  Typography,
} from "@mui/material";
import { DateRange } from "@mui/x-date-pickers-pro";
import dayjs, { Dayjs } from "dayjs";
import { useContext, useState } from "react";
import CalendarGeneric from "src/components/CalendarGenericForm";
import { AuthContext } from "../../context";
import { AuthContextValue } from "../../interfaces/auth.context.value";
import { formatDate } from "../../utils/formatDate";
import { TableList } from "../book/components/TableList";
import DashboardHook from "./Dashboard.hook";

export default function Dashboard() {
  const [currentPage, setCurrentPage] = useState(1);
  const { user } = useContext(AuthContext) as AuthContextValue;
  const [isFormUpdateBookingUserOpen, setIsFormUpdateBookingUserOpen] =
    useState(false);
  const [dateRange, setDateRange] = useState<DateRange<Dayjs>>([null, null]);
  const [bookingId, setbookingId] = useState<number | null>(null);
  const [openBookingId, setOpenBookingId] = useState<number | null>(null);

  const limit = 6;

  const {
    bookingsUser,
    totalPages,
    updateBookingMutation,
    deleteBookingMutation,
  } = DashboardHook(currentPage, limit);

  const bookings = bookingsUser?.map((booking) => ({
    startAt: dayjs(booking.startAt),
    endAt: dayjs(booking.endAt),
  }));

  const shouldDisableDate = (date: Dayjs) => {
    // Désactiver les dates avant aujourd'hui
    const today = dayjs();
    if (date.isBefore(today, "day")) {
      return true;
    }

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

  const handlePageChange = (
    _event: React.ChangeEvent<unknown>,
    page: number
  ) => {
    setCurrentPage(page);
  };

  const handleDialogOpen = (bookingId: number) => {
    setbookingId(bookingId);
    setOpenBookingId(bookingId);
  };

  const handleDialogClose = () => {
    setbookingId(null);
    setOpenBookingId(null);
  };

  const deleteBookingConfirmation = async () => {
    try {
      await deleteBookingMutation(openBookingId!);
      handleDialogClose();
    } catch (error) {
      console.error(error);
    }
  };

  const headCells = [
    "Name",
    "Couverture",
    "Date de début",
    "Date de fin",
    "action",
  ];

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
        <>
          <IconButton
            aria-label="edit"
            onClick={() => editUser(bookingUser.bookingId)}
          >
            <EditTwoToneIcon />
          </IconButton>
          <Tooltip
            title={
              bookingUser.hasFuturReservations
                ? "Ce livre a des reservation futures"
                : "Supprimer ce livre"
            }
            arrow
            disableInteractive
          >
            <span>
              <IconButton
                onClick={() => handleDialogOpen(bookingUser.bookingId)}
                aria-label="delete"
                disabled={bookingUser.hasFuturReservations}
              >
                <DeleteTwoToneIcon />
              </IconButton>
            </span>
          </Tooltip>
          <Dialog
            open={openBookingId !== null}
            onClose={handleDialogClose}
            aria-labelledby="delete-dialog-title"
            aria-describedby="delete-dialog-description"
          >
            <DialogTitle id="delete-dialog-title">
              Confirmer la suppression
            </DialogTitle>
            <DialogContent>
              <DialogContentText id="delete-dialog-description">
                `Êtes-vous sûr de vouloir supprimer ${bookingUser.name} ? Cette
                action est irréversible.`
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleDialogClose} color="primary">
                Annuler
              </Button>
              <Button
                onClick={deleteBookingConfirmation}
                color="error"
                autoFocus
              >
                Supprimer
              </Button>
            </DialogActions>
          </Dialog>
        </>,
      ],
    })) || [];

  const editUser = (bookingId: number) => {
    setbookingId(bookingId);
    setIsFormUpdateBookingUserOpen(true);
  };

  const handleclick = () => {
    const [startAt, endAt] = dateRange.map((date, index) =>
      dayjs(date)
        .set("hour", index === 0 ? 0 : 23)
        .set("minute", index === 0 ? 0 : 59)
        .set("second", index === 0 ? 0 : 59)
        .toISOString()
    );
    const inputForm = {
      id: bookingId!,
      startAt,
      endAt,
    };
    updateBookingMutation(inputForm);
    setIsFormUpdateBookingUserOpen(false);
  };

  return (
    <Container sx={{ py: 8 }} maxWidth="lg">
      <Typography component="h1" variant="h5" mb="30px">
        Réservation de {user?.name}
      </Typography>
      <TableList headCells={headCells} rows={rows} />
      <Modal
        open={isFormUpdateBookingUserOpen}
        onClose={() => setIsFormUpdateBookingUserOpen(false)}
      >
        <Box
          sx={{
            p: 4,
            backgroundColor: "white",
            margin: "auto",
            mt: 25,
            width: "50%",
            borderRadius: 2,
            boxShadow: 24,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <CalendarGeneric
            value={dateRange}
            onChange={(newValue) => setDateRange(newValue)}
            shouldDisableDate={shouldDisableDate}
            onActionClick={handleclick}
            actionLabel="Réserver"
            user={user ? true : false}
            justifyContent="center"
          />
        </Box>
      </Modal>
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
