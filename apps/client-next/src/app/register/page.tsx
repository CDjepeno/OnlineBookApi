"use client";

import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import {
  FormControl,
  Grid2,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
} from "@mui/material";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Link from "@mui/material/Link";
import Typography from "@mui/material/Typography";
import { Controller } from "react-hook-form";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useState } from "react";
import RegisterHook from "./register.hook";
import FormInput from "@/components/FormInput";
export default function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const {
    onSubmit,
    handleSubmit,
    setError,
    watch,
    control,
    errors,
    isSubmitting,
  } = RegisterHook();

  const password = watch("password", "");
  const confirmPassword = watch("confirmPassword", "");

  const isPasswordMatch = password === confirmPassword;

  const handleConfirmPasswordMatch = () => {
    if (!isPasswordMatch) {
      setError("confirmPassword", {
        type: "manual",
        message: "Les mots de passe ne correspondent pas.",
      });
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          my: 8,
          mx: 4,
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Inscription
        </Typography>
        <Box
          component="form"
          noValidate
          onSubmit={handleSubmit(onSubmit)}
          sx={{ mt: 3 }}
        >
          <Grid2 container spacing={2}>
            <Grid2 size={12}>
              <FormInput
                name="name"
                label="Prénom"
                control={control}
                errors={errors}
              />
            </Grid2>
            <Grid2 size={12}>
              <FormInput
                name="email"
                label="Adresse mail"
                errors={errors}
                control={control}
              />
            </Grid2>
            <Grid2 size={12}>
              <FormInput
                name="phone"
                label="Téléphone"
                control={control}
                errors={errors}
              />
            </Grid2>
            <Grid2 size={12}>
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
            </Grid2>
            <Grid2 size={12}>
              {/* <FormInput
                name="password"
                label="password"
                type={showPassword ? "text" : "password"}
                control={control}
                errors={errors}
                onBlur={handleConfirmPasswordChange}
                // slots={{
                //   input: "input",
                // }}
                // slotProps={{
                //   input: {
                //     endAdornment: (
                //       <InputAdornment position="end">
                //         <IconButton
                //           onClick={() => setShowPassword(!showPassword)}
                //           edge="end"
                //         >
                //           {showPassword ? <VisibilityOff /> : <Visibility />}
                //         </IconButton>
                //       </InputAdornment>
                //     ),
                //   },
                // }}
              /> */}
              {/* https://mui.com/material-ui/react-text-field/ */}
              <FormControl sx={{ width: "100%" }} variant="outlined" error={Boolean(errors.password)}>
                <InputLabel htmlFor="outlined-adornment-password">
                  Mot de passe
                </InputLabel>
                <Controller
                  name="password"
                  control={control}
                  defaultValue=""
                  render={({ field }) => (
                    <OutlinedInput
                    {...field} // Important pour lier React Hook Form
                    id="outlined-adornment-password"
                    type={showPassword ? "text" : "password"}
                    label="Mot de passe"
                    onBlur={handleConfirmPasswordMatch}
                      endAdornment={
                        <InputAdornment position="end">
                          <IconButton
                            aria-label={
                              showPassword
                                ? "hide the password"
                                : "display the password"
                            }
                            onClick={() => setShowPassword((prev) => !prev)}
                            edge="end"
                          >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      }
                    />
                  )}
                />
                {errors.password && (
                  <Typography variant="body2" color="error" sx={{ mt: 1 }}>
                    {errors.password.message}
                  </Typography>
                )}
              </FormControl>
            </Grid2>
            <Grid2 size={12}>
              {/* <FormInput
                name="confirmPassword"
                label="Confirm Password"
                type={showConfirmPassword ? "text" : "password"}
                control={control}
                errors={errors}
                // slots={{
                //   input: "input",
                // }}
                // slotProps={{
                //   input: {
                //     endAdornment: (
                //       <InputAdornment position="end">
                //         <IconButton
                //           onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                //           edge="end"
                //         >
                //           {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                //         </IconButton>
                //       </InputAdornment>
                //     ),
                //   },
                // }}
              /> */}
              <FormControl sx={{ width: "100%" }} variant="outlined" error={Boolean(errors.confirmPassword)}>
                <InputLabel htmlFor="outlined-adornment-password">
                  Confirm mot de passe
                </InputLabel>
                <Controller
                  name="confirmPassword"
                  control={control}
                  defaultValue=""
                  rules={{
                    required: "La confirmation du mot de passe est obligatoire",
                    validate: (value) =>
                      value === watch("password") ||
                      "Les mots de passe ne correspondent pas",
                  }}
                  render={({ field }) => (
                    <OutlinedInput
                      {...field} // Important pour lier React Hook Form
                      id="outlined-adornment-password"
                      type={showConfirmPassword ? "text" : "password"}
                      label="Confirmation Mot de passe"
                      onBlur={handleConfirmPasswordMatch}
                      endAdornment={
                        <InputAdornment position="end">
                          <IconButton
                            aria-label={
                              showConfirmPassword
                                ? "hide the password"
                                : "display the password"
                            }
                            onClick={() =>
                              setShowConfirmPassword((prev) => !prev)
                            }
                            edge="end"
                          >
                            {showConfirmPassword ? (
                              <VisibilityOff />
                            ) : (
                              <Visibility />
                            )}
                          </IconButton>
                        </InputAdornment>
                      }
                    />
                  )}
                />
                {errors.confirmPassword && (
                  <Typography variant="body2" color="error" sx={{ mt: 1 }}>
                    {errors.confirmPassword.message}
                  </Typography>
                )}
              </FormControl>
            </Grid2>
          </Grid2>
          <Button
            type="submit"
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            disabled={isSubmitting}
            fullWidth
          >
            Enregister
          </Button>
          <Grid2 container justifyContent="flex-end">
            <Grid2>
              <Link href="/login" variant="body2">
                Already have an account? Sign in
              </Link>
            </Grid2>
          </Grid2>
        </Box>
      </Box>
    </Container>
  );
}
