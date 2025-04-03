"use client";
import { UserFromData } from "@/types/user/input.types";
import { OAuthGoogleResponse } from "@/types/user/response.types";
import { yupResolver } from "@hookform/resolvers/yup";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import DeleteTwoToneIcon from "@mui/icons-material/DeleteTwoTone";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import RecyclingIcon from "@mui/icons-material/Recycling";
import {
  Avatar,
  Box,
  Button,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  Grid2,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  Tooltip,
  Typography,
} from "@mui/material";
import { GoogleCredentialResponse, GoogleLogin } from "@react-oauth/google";
import Link from "next/link";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";

import * as yup from "yup";

interface UserFormProps {
  onSubmit: (data: UserFromData) => void;
  deleteUserMutation?: (id: number) => void;
  googleCallback?: (input: string) => Promise<OAuthGoogleResponse>;
  userUpdate?: UserFromData;
  title: string;
  button: string;
}

const UserForm = ({
  onSubmit,
  title,
  button,
  userUpdate,
  deleteUserMutation,
  googleCallback,
}: UserFormProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [openUserId, setOpenUserId] = useState<number | null>(null);
  const [openUserName, setopenUserName] = useState("");

  const defaultValues: UserFromData = {
    id: userUpdate?.id || 0,
    email: userUpdate?.email || "",
    password: userUpdate?.password || "",
    confirmPassword: userUpdate?.confirmPassword || "",
    name: userUpdate?.name || "",
    phone: userUpdate?.phone || "",
    sexe: userUpdate?.sexe || "",
  };

  const isEditing = Boolean(userUpdate);

  const signupSchema = yup.object({
    email: yup
      .string()
      .email("Veuillez renseigner une adresse email valide")
      .matches(
        /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
        "Veuillez renseigner une adresse email valide"
      )
      .required("Veuillez renseigner une adresse email valide"),
    password: yup.string().when("$isEditing", {
      is: false, // Si userUpdate n'est PAS présent (création)
      then: (schema) =>
        schema
          .required("Veuillez renseigner un mot de passe")
          .min(6, "Votre mot de passe doit contenir au moins 6 caractères"),
      otherwise: (schema) => schema.notRequired(), // Sinon (modification) → pas obligatoire
    }),

    confirmPassword: yup.string().when("$isEditing", {
      is: false, // Si userUpdate n'est PAS présent (création)
      then: (schema) =>
        schema
          .required("Veuillez confirmer le mot de passe")
          .min(6, "Votre mot de passe doit contenir au moins 6 caractères"),
      otherwise: (schema) => schema.notRequired(), // Sinon (modification) → pas obligatoire
    }),
    name: yup
      .string()
      .required("Le nom doit être renseigné")
      .min(2, "Le nom doit être explicite"),
    phone: yup
      .string()
      .matches(
        /^(?:\+33|0)[1-9](?:\d{2}){4}$/,
        "Veuillez entrer un numéro de téléphone valide"
      )
      .required("Veuillez renseigner un numéro valide"),
    sexe: yup.string().required("Veuillez renseigner un numero valide"),
  });

  const {
    handleSubmit,
    setError,
    watch,
    control,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues,
    context: { isEditing },
    resolver: yupResolver(signupSchema),
  });

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

  const handleDialogOpen = (userId: number, name: string) => {
    setopenUserName(name);
    setOpenUserId(userId); // Ouvre la boîte de dialogue pour le livre sélectionné
  };

  const handleDialogClose = () => {
    setOpenUserId(null); // Ferme la boîte de dialogue
  };

  const DeleteUser = async (id: number) => {
    try {
      if (deleteUserMutation) {
        deleteUserMutation(id);
      }
      handleDialogClose();
    } catch (error) {
      console.error("Error deleting book:", error);
    }
  };

  const deleteUserConfirmation = async () => {
    console.log(openUserId);

    try {
      if (openUserId !== null) {
        // Suppression individuelle
        await DeleteUser(openUserId);
      }
      handleDialogClose();
    } catch (error) {
      console.error("Error during deletion:", error);
    }
  };

  const handleLoginSuccess = async (
    credentialResponse: GoogleCredentialResponse
  ) => {
    try {
      // Récupérer le token d'authentification fourni par Google
      const { credential } = credentialResponse;

      // // Envoie du token au backend pour le traitement
      if (googleCallback) {
        await googleCallback(credential!);
      }
    } catch (error) {
      console.error("Login failed:", error);
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
        {title === "Modifier l'utilisateur" && (
          <span>
            <Tooltip title="Supprimer utilisateur" arrow>
              <IconButton
                onClick={() => {
                  if (userUpdate?.id !== undefined) {
                    handleDialogOpen(userUpdate?.id, userUpdate?.name);
                  }
                }}
                aria-label="delete"
              >
                <DeleteTwoToneIcon />
              </IconButton>
            </Tooltip>
          </span>
        )}
        <Dialog
          open={openUserId !== null}
          onClose={handleDialogClose}
          aria-labelledby="delete-dialog-title"
          aria-describedby="delete-dialog-description"
        >
          <DialogTitle id="delete-dialog-title">
            Confirmer la suppression
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="delete-dialog-description">
              Êtes-vous sûr de vouloir supprimer {openUserName}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleDialogClose} color="primary">
              Annuler
            </Button>
            <Button onClick={deleteUserConfirmation} color="error" autoFocus>
              Supprimer
            </Button>
          </DialogActions>
        </Dialog>
        <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
          {button === "Modifier" ? <RecyclingIcon /> : <LockOutlinedIcon />}
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
            <Grid2 size={12}>
              <FormControl fullWidth error={Boolean(errors.name)}>
                <InputLabel>Prénom</InputLabel>
                <Controller
                  name="name"
                  control={control}
                  defaultValue=""
                  render={({ field }) => (
                    <OutlinedInput {...field} label="Prénom" />
                  )}
                />
                {errors.name && (
                  <Typography variant="body2" color="error">
                    {errors.name.message}
                  </Typography>
                )}
              </FormControl>
            </Grid2>

            <Grid2 size={12}>
              <FormControl fullWidth error={Boolean(errors.email)}>
                <InputLabel>Adresse mail</InputLabel>
                <Controller
                  name="email"
                  control={control}
                  defaultValue=""
                  render={({ field }) => (
                    <OutlinedInput {...field} label="Adresse mail" />
                  )}
                />
                {errors.email && (
                  <Typography variant="body2" color="error">
                    {errors.email.message}
                  </Typography>
                )}
              </FormControl>
            </Grid2>

            <Grid2 size={12}>
              <FormControl fullWidth error={Boolean(errors.phone)}>
                <InputLabel>Téléphone</InputLabel>
                <Controller
                  name="phone"
                  control={control}
                  render={({ field }) => (
                    <OutlinedInput {...field} label="Téléphone" />
                  )}
                />
                {errors.phone && (
                  <Typography variant="body2" color="error">
                    {errors.phone.message}
                  </Typography>
                )}
              </FormControl>
            </Grid2>

            <Grid2 size={12}>
              <FormControl fullWidth error={Boolean(errors.sexe)}>
                <InputLabel>Sexe</InputLabel>
                <Controller
                  name="sexe"
                  control={control}
                  defaultValue={userUpdate?.sexe || ""}
                  rules={{ required: "Le sexe est obligatoire" }}
                  render={({ field }) => (
                    <Select {...field} label="Sexe">
                      <MenuItem value="femme">Femme</MenuItem>
                      <MenuItem value="homme">Homme</MenuItem>
                    </Select>
                  )}
                />
                {errors.sexe && (
                  <Typography variant="body2" color="error">
                    {errors.sexe.message}
                  </Typography>
                )}
              </FormControl>
            </Grid2>
            {title === "Inscription" && (
              <Grid2 size={12}>
                <FormControl
                  fullWidth
                  error={Boolean(errors.password)}
                  variant="outlined"
                >
                  <InputLabel>Mot de passe</InputLabel>
                  <Controller
                    name="password"
                    control={control}
                    defaultValue=""
                    render={({ field }) => (
                      <OutlinedInput
                        {...field}
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
                            >
                              {showPassword ? (
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
                  {errors.password && (
                    <Typography variant="body2" color="error">
                      {errors.password.message}
                    </Typography>
                  )}
                </FormControl>
              </Grid2>
            )}
            {title === "Inscription" && (
              <Grid2 size={12}>
                <FormControl
                  fullWidth
                  error={Boolean(errors.confirmPassword)}
                  variant="outlined"
                >
                  <InputLabel>Confirmation Mot de passe</InputLabel>
                  <Controller
                    name="confirmPassword"
                    control={control}
                    defaultValue=""
                    rules={{
                      required:
                        "La confirmation du mot de passe est obligatoire",
                      validate: (value) =>
                        value === password ||
                        "Les mots de passe ne correspondent pas",
                    }}
                    render={({ field }) => (
                      <OutlinedInput
                        {...field}
                        id="outlined-adornment-confirm-password"
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
                    <Typography variant="body2" color="error">
                      {errors.confirmPassword.message}
                    </Typography>
                  )}
                </FormControl>
              </Grid2>
            )}
          </Grid2>
          <Button
            type="submit"
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            disabled={isSubmitting}
            fullWidth
          >
            {button}
          </Button>
          {title === "Inscription" && (
            <Grid2 container justifyContent="flex-end">
              <Grid2>
                <Box sx={{ mb: 2 }}>
                  <Link href="/login">Already have an account? Sign in</Link>
                </Box>
              </Grid2>
            </Grid2>
          )}
          {title === "Inscription" && (
            <GoogleLogin
              onSuccess={handleLoginSuccess}
              onError={() => {
                console.log("Login Failed");
              }}
            />
          )}
        </Box>
      </Box>
    </Container>
  );
};

export default UserForm;
