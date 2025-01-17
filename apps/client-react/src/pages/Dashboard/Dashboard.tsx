import DeleteTwoToneIcon from "@mui/icons-material/DeleteTwoTone";
import EditTwoToneIcon from "@mui/icons-material/EditTwoTone";
import {
  Box,
  Button,
  Checkbox,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Modal,
  Pagination,
  Stack,
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
  const [selectedBookingsIds, setSelectedBookingsIds] = useState<number[]>([]);
  const [isBulkDelete, setIsBulkDelete] = useState(false);
  const [openBookingTitle, setOpenBookingTitle] = useState("");

  const limit = 6;

  const {
    bookingsUser,
    totalPages,
    updateBookingMutation,
    deleteBookingMutation,
    deleteBookingsMutation,
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

  const handleDialogOpen = (bookingId: number, title: string) => {
    setOpenBookingTitle(title);
    setOpenBookingId(bookingId);
  };

  const handleDialogClose = () => {
    setOpenBookingId(null);
    setIsBulkDelete(false);
  };

  const handleBulkDeleteDialogOpen = () => {
    setIsBulkDelete(true);
    setOpenBookingId(null); // Pas d'ID spécifique pour une suppression multiple
  };

  const handleBulkDeleteDialogClose = () => {
    setIsBulkDelete(false);
    setSelectedBookingsIds([]);
    setOpenBookingId(null);
  };

  const toggleSelectAllBookings = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (event.target.checked) {
      // Sélectionne tous les livres disponibles
      const allSelectableBookIds =
        bookingsUser?.map((bookingUser) => bookingUser.bookingId) || [];
      setSelectedBookingsIds(allSelectableBookIds);
    } else {
      // Désélectionne tous les livres
      setSelectedBookingsIds([]);
    }
  };

  const isAllSelected =
    bookingsUser &&
    bookingsUser.length > 0 &&
    selectedBookingsIds.length ===
      bookingsUser!.map((bookingUser) => !bookingUser.bookingId).length;

  const isIndeterminate = selectedBookingsIds.length > 0 && !isAllSelected;

  const toggleSelectBooking = (id: number) => {
    setSelectedBookingsIds((prev) =>
      prev.includes(id) ? prev.filter((bookId) => bookId !== id) : [...prev, id]
    );
  };

  const deleteBookingsConfirmation = async () => {
    try {
      if (isBulkDelete) {
        // Suppression en masse
        await deleteBookingsMutation(selectedBookingsIds);
        setSelectedBookingsIds([]);
      } else if (openBookingId !== null) {
        // Suppression individuelle
        await deleteBookingMutation(openBookingId!);
      }
      handleDialogClose();
    } catch (error) {
      console.error("Error during deletion:", error);
    }
  };

  const headCells = [
    <Checkbox
      onChange={toggleSelectAllBookings}
      checked={isAllSelected}
      indeterminate={isIndeterminate}
    />,
    "Name",
    "Couverture",
    "Date de début",
    "Date de fin",
    "action",
  ];

  const rows =
    bookingsUser?.map((bookingUser) => ({
      cells: [
        <Checkbox
          checked={selectedBookingsIds.includes(bookingUser.bookingId)}
          onChange={() => toggleSelectBooking(bookingUser.bookingId)}
          // disabled={bookingUser.hasFuturReservations} // Désactiver si la suppression est impossible
        />,
        bookingUser.title,
        <img
          src={bookingUser.coverUrl}
          alt="couverture du book"
          style={{ width: "90px", height: "60px", objectFit: "cover" }}
        />,
        formatDate(bookingUser.startAt),
        formatDate(bookingUser.endAt),
        <Stack direction="row" justifyContent="start">
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
                onClick={() =>
                  handleDialogOpen(bookingUser.bookingId, bookingUser.title)
                }
                aria-label="delete"
              >
                <DeleteTwoToneIcon />
              </IconButton>
            </span>
          </Tooltip>
          <Dialog
            open={isBulkDelete || openBookingId !== null}
            onClose={handleBulkDeleteDialogClose}
            aria-labelledby="delete-dialog-title"
            aria-describedby="delete-dialog-description"
          >
            <DialogTitle id="delete-dialog-title">
              Confirmer la suppression
            </DialogTitle>
            <DialogContent>
              <DialogContentText id="delete-dialog-description">
                {isBulkDelete
                  ? `Êtes-vous sûr de vouloir supprimer les ${selectedBookingsIds.length} réservations sélectionnés ? Cette action est irréversible.`
                  : `Êtes-vous sûr de vouloir supprimer la réservation du livre ${openBookingTitle} ? Cette action est irréversible.`}
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleBulkDeleteDialogClose} color="primary">
                Annuler
              </Button>
              <Button
                onClick={deleteBookingsConfirmation}
                color="error"
                autoFocus
              >
                Supprimer
              </Button>
            </DialogActions>
          </Dialog>
        </Stack>,
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
      <div>
        <Button
          onClick={handleBulkDeleteDialogOpen}
          color="error"
          variant="contained"
          disabled={selectedBookingsIds.length === 0} // Désactiver si aucune sélection
        >
          Supprimer les réservations sélectionnés
        </Button>
      </div>
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
