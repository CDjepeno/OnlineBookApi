// UserForm.tsx
import {
  Avatar,
  Box,
  Button,
  Container,
  FormControl,
  Grid2,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
} from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { Typography } from "@mui/material";
import { UserFormInput, UserFromData } from "@/types/user/input.types";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Link from "next/link";
import RecyclingIcon from "@mui/icons-material/Recycling";

interface UserFormProps {
  setShowPassword: React.Dispatch<React.SetStateAction<boolean>>;
  showPassword: boolean;
  setShowConfirmPassword: React.Dispatch<React.SetStateAction<boolean>>;
  showConfirmPassword: boolean;
  handleConfirmPasswordMatch?: () => void;
  onSubmit: (data: UserFromData) => void;
  userUpdate?: UserFromData;
  title: string;
  button: string;
}

const UserForm = ({
  setShowPassword,
  showPassword,
  setShowConfirmPassword,
  showConfirmPassword,
  onSubmit,
  title,
  button,
}: UserFormProps) => {
  const defaultValues: UserFormInput = {
    email: "",
    password: "",
    confirmPassword: "",
    name: "",
    phone: "",
    sexe: "",
  };

  const signupSchema = yup.object({
    email: yup
      .string()
      .email("Veuillez renseigner une adresse email valide")
      .matches(
        /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
        "Veuillez renseigner une adresse email valide"
      )
      .required("Veuillez renseigner une adresse email valide"),
    password: yup
      .string()
      .required("Veuillez renseigner un mot de passe")
      .min(6, "Votre mot de passe doit contenir au moins 6 caractères"),
    confirmPassword: yup
      .string()
      .required("Veuillez confirmer le mot de passe")
      .min(6, "Votre mot de passe doit contenir au moins 6 caractères"),
    name: yup
      .string()
      .required("Le nom doit être renseigné")
      .min(2, "Le nom doit être explicite")
      .max(10, "Le titre doit être succinct"),
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
  } = useForm({ defaultValues, resolver: yupResolver(signupSchema) });
  
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
          {title === "Modifier" ? <RecyclingIcon /> : <LockOutlinedIcon />}
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
                  defaultValue=""
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
                  defaultValue=""
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
                            {showPassword ? <VisibilityOff /> : <Visibility />}
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
                    required: "La confirmation du mot de passe est obligatoire",
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
          {title === "Modifier" && (
            <Grid2 container justifyContent="flex-end">
              <Grid2>
                <Link href="/login">Already have an account? Sign in</Link>
              </Grid2>
            </Grid2>
          )}
        </Box>
      </Box>
    </Container>
  );
};

export default UserForm;
