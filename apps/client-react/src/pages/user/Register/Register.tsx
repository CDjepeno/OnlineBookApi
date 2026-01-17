import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import {
  FormControl,
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
import Grid from "@mui/material/Grid";
import Link from "@mui/material/Link";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { useState } from "react";
import { Controller } from "react-hook-form";
import FormInput from "../../../components/FormInput";
import { Sexe } from "../../../enum/sexe.enum";
import RegisterHook from "./Register.hook";

export default function Register() {
  const { onSubmit, handleSubmit, control, errors, isSubmitting } =
    RegisterHook();

  const [showPassord, setShowPassword] = useState(false);
  const [showConfirmPassord, setShowConfirmPassword] = useState(false);

  const handleClickShowPassword = () => {
    setShowPassword(!showPassord);
  };

  const handleClickShowConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassord);
  };

  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };

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
          Sign up
        </Typography>
        <Box
          component="form"
          noValidate
          onSubmit={handleSubmit(onSubmit)}
          sx={{ mt: 3 }}
        >
          <Grid container spacing={2}>
            <Grid size={12}>
              <FormInput
                name="name"
                label="Name"
                control={control}
                errors={errors}
              />
            </Grid>
            <Grid size={12}>
              <FormInput
                name="phone"
                label="Numéro de téléphone"
                control={control}
                errors={errors}
              />
            </Grid>
            <Grid size={12}>
              <FormInput
                name="email"
                label="Email"
                errors={errors}
                control={control}
              />
            </Grid>
            <Grid size={12}>
              <FormControl fullWidth error={!!errors.sexe}>
                <InputLabel id="sexe-label">Sexe</InputLabel>

                <Controller
                  name="sexe"
                  control={control}
                  render={({ field }) => (
                    <Select {...field} labelId="sexe-label" label="Sexe">
                      <MenuItem value="">Sélectionner</MenuItem>
                      <MenuItem value={Sexe.HOMME}>Homme</MenuItem>
                      <MenuItem value={Sexe.FEMME}>Femme</MenuItem>
                    </Select>
                  )}
                />

                {errors.sexe && (
                  <Typography color="error" variant="caption">
                    {errors.sexe.message}
                  </Typography>
                )}
              </FormControl>
            </Grid>
            <Grid size={12}>
              <Controller
                name="password"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    required
                    fullWidth
                    label="Mot de passe"
                    type={showPassord ? "text" : "password"}
                    error={!!errors.password}
                    helperText={errors.password?.message}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            arial-label="toggle password visibility"
                            onClick={handleClickShowPassword}
                            onMouseDown={handleClickShowPassword}
                            edge="end"
                          >
                            {showPassord ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                )}
              />
            </Grid>
            <Grid size={12}>
              <Controller
                name="confirmPassword"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    required
                    fullWidth
                    label="Confirmer le mot de passe"
                    type={showConfirmPassord ? "text" : "password"}
                    error={!!errors.confirmPassword}
                    helperText={errors.confirmPassword?.message}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={handleClickShowConfirmPassword}
                            onMouseDown={handleMouseDownPassword}
                            edge="end"
                          >
                            {showConfirmPassord ? (
                              <VisibilityOff />
                            ) : (
                              <Visibility />
                            )}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
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
            S'inscrire
          </Button>
          <Grid container justifyContent="flex-end">
            <Grid item>
              <Link href="/login" variant="body2">
                Vous avez déjà un compte ? Connectez-vous
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Container>
  );
}
