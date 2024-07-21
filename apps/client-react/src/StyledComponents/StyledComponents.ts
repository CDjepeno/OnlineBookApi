import styled, { createGlobalStyle } from "styled-components";
import Button from "@mui/material/Button";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";

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
