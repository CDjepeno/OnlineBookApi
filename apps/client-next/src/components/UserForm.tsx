"use client";

import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import {
  FormControl,
  Grid2,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Link from "@mui/material/Link";
import Typography from "@mui/material/Typography";
import { Controller, useForm } from "react-hook-form";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useEffect, useState } from "react";
import FormInput from "@/components/FormInput";
import { UserFormInput } from "@/types/user/input.types";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

interface UserFormProps {
  title: string;
  button: string;
  onSubmit: (data: UserFormInput) => void;
  userUpdate?: UserFormInput;
}

export default function UserForm({
  title,
  button,
  onSubmit,
  userUpdate,
}: UserFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const userSchema = yup.object({
    name: yup.string().required("Le titre doit être renseigné"),
    email: yup
      .string()
      .required("Il faut préciser votre email")
      .email("l'email n'est pas valide"),
    phone: yup.string()
      .matches(
        /^(?:\+(\d{1,3}))?[-. ]?(\(?\d{1,4}\)?)[-. ]?(\d{1,4})[-. ]?(\d{1,4})[-. ]?(\d{1,4})$/,
        "Le numéro de téléphone est invalide"
      )
      .required("Le numéro de téléphone est requis"),
    sexe: yup.string().required("Le sex doit être renseigné"),
    password: yup
          .string()
          .required("Il faut préciser votre mot de passe")
          .min(6, "Mot de passe trop court"),
    confirmPassword: yup
          .string()
          .required("Il faut préciser votre mot de passe")
          .min(6, "Mot de passe trop court"),
  });
  const {
    handleSubmit,
    control,
    reset,
    watch,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<UserFormInput>({
    defaultValues: userUpdate ?? undefined,
    resolver: yupResolver(userSchema),
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

  useEffect(() => {
    reset(userUpdate || undefined);
  }, [userUpdate, reset]);

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
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          {title}
        </Typography>
        <Box
          component="form"
          noValidate
          onSubmit={handleSubmit(onSubmit)}
          sx={{ mt: 3 }}
        >
          <Grid2 container spacing={2}>
            <Grid2>
              <FormInput
                name="name"
                label="Name"
                control={control}
                errors={errors}
              />
              {errors.name && (
                <small style={{ color: "red" }}>{errors.name.message}</small>
              )}
            </Grid2>
            <Grid2>
              <FormInput
                name="email"
                label="Email Address"
                errors={errors}
                control={control}
              />

              {errors.email && (
                <small style={{ color: "red" }}>{errors.email.message}</small>
              )}
            </Grid2>
            <Grid2>
              <FormInput
                name="phone"
                label="Phone"
                control={control}
                errors={errors}
              />
              {errors.phone && (
                <small style={{ color: "red" }}>{errors.phone.message}</small>
              )}
            </Grid2>
            <Grid2>
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
            <Grid2>
              <FormInput
                name="password"
                label="password"
                type={showPassword ? "text" : "password"}
                control={control}
                onBlur={() => handleConfirmPasswordChange}
                errors={errors}
                slots={{
                  input: InputAdornment,
                }}
                slotProps={{
                  input: {
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowPassword(!showPassword)}
                          edge="end"
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  },
                }}
              />
            </Grid2>
            <Grid2>
              <FormInput
                name="confirmPassword"
                label="Confirm Password"
                type={showConfirmPassword ? "text" : "password"}
                control={control}
                errors={errors}
                onBlur={handleConfirmPasswordChange}
                slots={{
                  input: InputAdornment,
                }}
                slotProps={{
                  input: {
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() =>
                            setShowConfirmPassword(!showConfirmPassword)
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
                    ),
                  },
                }}
              />
            </Grid2>
          </Grid2>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            disabled={isSubmitting}
          >
            {button}
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
