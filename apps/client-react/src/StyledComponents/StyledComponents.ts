import styled, { createGlobalStyle } from "styled-components";
import Button from "@mui/material/Button";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { Box } from "@mui/material";

// Styles globaux
export const GlobalStyle = createGlobalStyle`
  .react-datepicker-wrapper,
  .react-datepicker__input-container {
    width: 100%;
  }
`;

// Composants stylisés
export const StyledButton = styled(Button)`
  display: flex;
  align-items: center;
  width: 100%;
`;

export const IconWithMargin = styled(CloudUploadIcon)`
  margin-right: 8px;
`;

export const CalendarWrapper = styled(Box)`
  .react-datepicker {
    font-family: "Roboto", sans-serif;
    border-radius: 8px;
    box-shadow: none;
    padding: 16px;
    display: flex;
    gap: 24px;

    /* Supprime toute bordure ou outline */
    border: none !important;
    outline: none !important;
  }

  .react-datepicker__month-container {
    flex: 1;
  }

  /* ================= Effet plage ================= */
  .react-datepicker__day--in-range {
    background-color: rgba(25, 118, 210, 0.25) !important;
    color: #1976d2 !important;
    border-radius: 0 !important;
  }

  .react-datepicker__day--selected {
    background-color: #1976d2 !important;
    color: white !important;
    border-radius: 50% !important;
  }

  .react-datepicker__day--in-selecting-range {
    background-color: rgba(144, 202, 249, 0.5) !important;
    color: #1976d2 !important;
  }

  .react-datepicker__day--range-start {
    background-color: #1976d2 !important;
    color: white !important;
    border-top-left-radius: 50% !important;
    border-bottom-left-radius: 50% !important;
  }

  .react-datepicker__day--range-end {
    background-color: #1976d2 !important;
    color: white !important;
    border-top-right-radius: 50% !important;
    border-bottom-right-radius: 50% !important;
  }

  .react-datepicker__day:hover {
    background-color: rgba(25, 118, 210, 0.2);
    color: #1976d2;
    border-radius: 50%;
  }

  /* ================= Header ================= */
  .react-datepicker__header {
    background-color: transparent;
    border-bottom: none;
    padding-bottom: 8px;
  }

  .react-datepicker__current-month {
    font-weight: 500;
    margin-bottom: 8px;
  }

  /* Supprime les outlines des jours sur focus */
  .react-datepicker__day:focus {
    outline: none !important;
    box-shadow: none !important;
  }

  /* Supprime outline du calendrier entier */
  .react-datepicker:focus {
    outline: none !important;
    box-shadow: none !important;
  }
`;
