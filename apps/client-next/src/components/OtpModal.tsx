import React, { useState } from "react";
import { Modal, Box, Typography, TextField, Button } from "@mui/material";

type OtpModalProps = {
  open: boolean;
  handleClose: () => void;
  onVerify: (otp: string) => Promise<void>;
};

const OtpModal: React.FC<OtpModalProps> = ({ open, handleClose, onVerify }) => {
  const [otp, setOtp] = useState("");

  const handleSubmit = async () => {
    if (otp.length === 6) {
      await onVerify(otp); // Appel API pour vérifier le code
    } else {
      alert("Le code doit contenir 6 chiffres !");
    }
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 300,
          bgcolor: "white",
          boxShadow: 24,
          p: 4,
          borderRadius: 2,
        }}
      >
        <Typography variant="h6" textAlign="center">
          Vérification OTP
        </Typography>
        <TextField
          fullWidth
          label="Code OTP"
          variant="outlined"
          margin="normal"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          inputProps={{ maxLength: 6, style: { textAlign: "center" } }}
        />
        <Button
          fullWidth
          variant="contained"
          color="primary"
          onClick={handleSubmit}
          disabled={otp.length !== 6}
        >
          Vérifier
        </Button>
      </Box>
    </Modal>
  );
};

export default OtpModal;
