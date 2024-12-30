import UpdateIcon from "@mui/icons-material/Update";
import {
  Avatar,
  Box,
  Button,
  Container,
  CssBaseline,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import Link from "@mui/material/Link";
import { fr } from "date-fns/locale";
import { useEffect } from "react";
import { registerLocale } from "react-datepicker";
import { Controller, useForm } from "react-hook-form";
import FormInput from "src/components/FormInput";
import { UserForm } from "src/types/user/form.types";
import { UserFormInput } from "src/types/user/input.types";
import { createGlobalStyle } from "styled-components";
import UserUpdateRegisterHook from "../UserUpdateRegister.hook";

registerLocale("fr", fr);

const GlobalStyle = createGlobalStyle`
  .react-datepicker-wrapper,
  .react-datepicker__input-container {
    width: 100%;
  }
`;

type UserUpdateFormProps = {
  userUpdate: UserFormInput;
  setIsFormUpdateUserOpen: (value: boolean) => void;
};

function UserUpdateForm({
  userUpdate,
  setIsFormUpdateUserOpen,
}: UserUpdateFormProps) {
  const {
    control,
    reset,
    handleSubmit,
    watch,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<UserForm>({
    defaultValues: {
      ...userUpdate,
    },
  });

  const password = watch("password", "");
  const confirmPassword = watch("confirmPassword", "");

  const isPasswordMatch = password === confirmPassword;

  const handleConfirmPasswordChange = () => {
    if (!isPasswordMatch) {
      setError("confirmPassword", {
        type: "manual",
        message: "Les mots de passe ne correspondent pas.",
      });
    }
  };

  const { onSubmit } = UserUpdateRegisterHook(setIsFormUpdateUserOpen);

  useEffect(() => {
    reset(userUpdate);
  }, [userUpdate, reset]);

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
        <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
          <UpdateIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign up
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
                name="phone"
                label="Phone"
                control={control}
                errors={errors}
              />
              {errors.phone && (
                <small style={{ color: "red" }}>{errors.phone.message}</small>
              )}
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth error={Boolean(errors.sexe)}>
                <InputLabel id="demo-simple-select-label">Sexe</InputLabel>
                <Controller
                  name="sexe"
                  control={control}
                  defaultValue=""
                  rules={{ required: "Le sexe est obligatoire" }}
                  render={({ field }) => (
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      label="Sexe"
                      {...field}
                    >
                      <MenuItem value="femme">Femme</MenuItem>
                      <MenuItem value="homme">Homme</MenuItem>
                    </Select>
                  )}
                />
                {errors.sexe && (
                  <Typography variant="body2" color="error" sx={{ mt: 1 }}>
                    {errors.sexe.message}
                  </Typography>
                )}
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <FormInput
                name="password"
                label="password"
                type="password"
                control={control}
                onblur={() => handleConfirmPasswordChange}
                errors={errors}
              />
            </Grid>
            <Grid item xs={12}>
              <Controller
                name="confirmPassword"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    required
                    fullWidth
                    label="Confirm Password"
                    type="password"
                    error={!isPasswordMatch}
                    helperText={
                      !isPasswordMatch
                        ? "Les mots de passe ne correspondent pas."
                        : ""
                    }
                  />
                )}
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
            Sign Up
          </Button>
          <Grid container justifyContent="flex-end">
            <Grid item>
              <Link href="/login" variant="body2">
                Already have an account? Sign in
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Container>
  );
}

export default UserUpdateForm;
