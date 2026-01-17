import FormInput from "../../components/FormInput";
import { GlobalStyle } from "../../StyledComponents/StyledComponents";
import {
  Box,
  Button,
  Container,
  CssBaseline,
  Grid,
  Typography,
} from "@mui/material";
import AddContactHook from "./AddContact.hook";

function AddContactForm() {
  const { submit, handleSubmit, control, isSubmitting, errors } =
    AddContactHook();

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <GlobalStyle />
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Typography component="h1" variant="h5">
          Contactez-nous
        </Typography>

        <Box
          component="form"
          noValidate
          onSubmit={handleSubmit(submit)}
          sx={{ mt: 3 }}
        >
          <Grid container spacing={2}>
            <Grid size={12}>
              <FormInput
                name="name"
                label="Nom"
                control={control}
                errors={errors}
              />
            </Grid>

            <Grid size={12}>
              <FormInput
                name="email"
                label="Email"
                control={control}
                errors={errors}
              />
            </Grid>

            <Grid size={12}>
              <FormInput
                name="message"
                label="Message"
                control={control}
                errors={errors}
                multiline
                rows={4}
              />
            </Grid>
          </Grid>

          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            disabled={isSubmitting}
          >
            Envoyer le message
          </Button>
        </Box>
      </Box>
    </Container>
  );
}

export default AddContactForm;
