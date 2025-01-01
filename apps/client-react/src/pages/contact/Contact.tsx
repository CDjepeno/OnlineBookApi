import { yupResolver } from "@hookform/resolvers/yup";
import ContactPageIcon from "@mui/icons-material/ContactPage";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import { useForm } from "react-hook-form";
import FormInput from "src/components/FormInput";
import { ContactFormType } from "src/types/contact/form.types";
import ContactHook from "./Contact.hook";

export default function Contact() {
  const { onSubmit, signupSchema } = ContactHook();

  const {
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormType>({ resolver: yupResolver(signupSchema) });

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
          <ContactPageIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Contact
        </Typography>
        <Box
          component="form"
          noValidate
          onSubmit={handleSubmit(onSubmit)}
          sx={{ mt: 3 }}
        >
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <FormInput
                name="name"
                label="Name"
                control={control}
                errors={errors}
              />
              {errors.name && (
                <small style={{ color: "red" }}>{errors.name.message}</small>
              )}
            </Grid>
            <Grid item xs={12}>
              <FormInput
                name="email"
                label="Email Address"
                errors={errors}
                control={control}
              />

              {errors.email && (
                <small style={{ color: "red" }}>{errors.email.message}</small>
              )}
            </Grid>
            <Grid item xs={12}>
              <FormInput
                name="message"
                label="message"
                control={control}
                errors={errors}
                customField={({ field, fieldState }) => (
                  <div style={{ marginBottom: "1rem" }}>
                    <textarea
                      {...field}
                      placeholder="Message ..."
                      maxLength={300}
                      rows={5}
                      style={{
                        width: "100%",
                        padding: "0.5rem",
                        border: "1px solid #ccc",
                        borderRadius: "4px",
                        fontSize: "1rem",
                        resize: "none",
                      }}
                    />
                    {fieldState.error && (
                      <span style={{ color: "red", fontSize: "0.875rem" }}>
                        {fieldState.error.message}
                      </span>
                    )}
                  </div>
                )}
              />
              {errors.message && (
                <small style={{ color: "red" }}>{errors.message.message}</small>
              )}
            </Grid>
          </Grid>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            disabled={isSubmitting}
          >
            envoyer
          </Button>
        </Box>
      </Box>
    </Container>
  );
}
