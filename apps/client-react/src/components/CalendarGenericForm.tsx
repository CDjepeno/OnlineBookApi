import React from "react";
import { Box, Button } from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateRange, DateRangeCalendar } from "@mui/x-date-pickers-pro";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import dayjs, { Dayjs } from "dayjs";

interface CalendarGenericProps {
  value: DateRange<dayjs.Dayjs>;
  onChange: (newValue: DateRange<Dayjs>) => void;
  shouldDisableDate?: (date: Dayjs) => boolean;
  onActionClick?: () => void;
  actionLabel?: string;
  width?: string;
  showAction?: boolean;
  user?: boolean;
}

const CalendarGeneric: React.FC<CalendarGenericProps> = ({
  value,
  onChange,
  shouldDisableDate,
  onActionClick,
  actionLabel = "Submit",
  width = "100%",
  showAction = true,
  user = false,
}) => {
  return (
    <Box sx={{ width }}>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DemoContainer components={["DateRangeCalendar"]}>
          <DateRangeCalendar
            value={value}
            onChange={onChange}
            shouldDisableDate={shouldDisableDate}
          />
        </DemoContainer>
      </LocalizationProvider>
      {showAction && user && (
        <Button
          type="button"
          fullWidth
          variant="contained"
          sx={{ mt: 3, mb: 2 }}
          onClick={onActionClick}
        >
          {actionLabel}
        </Button>
      )}
    </Box>
  );
};

export default CalendarGeneric;