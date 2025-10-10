import { Box, Button, Typography } from "@mui/material";
import { useContext, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useParams } from "react-router-dom";
import { AuthContext } from "../../context";
import { CalendarWrapper } from "../../StyledComponents/StyledComponents";
import { AuthContextType } from "../../types/user/auth.context.type";
import AddBookBookingHook from "./AddBookBooking.hook";
import BookBookingHook from "./BookBooking.hook";

export default function BookBooking() {
  const { user } = useContext(AuthContext) as AuthContextType;
  const userId = user && user.id;
  const { id: bookId } = useParams<{ id: string }>();

  const { bookings = [] } = BookBookingHook();
  const { handleBooking } = AddBookBookingHook(bookId!, userId);

  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const today = new Date();

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 2,
      }}
    >
      <CalendarWrapper>
        <DatePicker
          selected={startDate}
          onChange={(dates: [Date | null, Date | null] | null) => {
            if (!dates) return;
            const [start, end] = dates;
            setStartDate(start);
            setEndDate(end);
          }}
          startDate={startDate}
          endDate={endDate}
          selectsRange
          inline
          monthsShown={2}
          excludeDateIntervals={bookings.map((b) => ({
            start: new Date(b.startAt),
            end: new Date(b.endAt),
          }))}
          filterDate={(date) => date >= today}
        />
      </CalendarWrapper>

      <Button
        variant="contained"
        color="primary"
        onClick={() => handleBooking(startDate, endDate)}
        fullWidth
      >
        Réserver
      </Button>

      {startDate && endDate && (
        <Typography variant="body2" color="text.secondary">
          Réservation : {startDate.toLocaleDateString()} →{" "}
          {endDate.toLocaleDateString()}
        </Typography>
      )}
    </Box>
  );
}
