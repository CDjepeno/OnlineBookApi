import CancelIcon from "@mui/icons-material/Cancel";
import SaveIcon from "@mui/icons-material/Save";
import {
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Container,
  FormControl,
  FormControlLabel,
  FormHelperText,
  FormLabel,
  Grid,
  Radio,
  RadioGroup,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect } from "react";
import { Controller } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { ProfileHook } from "../Profile.hook";
import ProfileEditHook from "./ProfileEdit.hook";

export function ProfileEdit() {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  // const { user: currentUser } = useContext(AuthContext) as AuthContextType;
  const { user, isLoading } = ProfileHook();
  const { submit, handleSubmit, control, reset, errors } = ProfileEditHook(
    userId!
  );

  // Pré-remplir le formulaire quand les données sont chargées
  useEffect(() => {
    if (user) {
      reset({
        name: user.name,
        email: user.email,
        phone: user.phone || "",
        sexe: user.sexe,
      });
    }
  }, [user, reset]);

  const handleCancel = () => {
    navigate(`/profile/${userId}`);
  };

  // Vérifier si c'est le profil de l'utilisateur connecté
  // const isOwnProfile = currentUser?.id === userId;

  // if (!isOwnProfile) {
  //   return (
  //     <Container sx={{ mt: 4, textAlign: "center" }}>
  //       <Typography variant="h6" color="error">
  //         Vous ne pouvez modifier que votre propre profil
  //       </Typography>
  //     </Container>
  //   );
  // }

  if (isLoading || !user) {
    return (
      <Container sx={{ mt: 4, textAlign: "center" }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Card>
        <CardContent sx={{ p: 4 }}>
          <Typography variant="h5" gutterBottom>
            Modifier mon profil
          </Typography>

          <Box component="form" onSubmit={handleSubmit(submit)} sx={{ mt: 3 }}>
            <Grid container spacing={3}>
              {/* Nom */}
              <Grid item xs={12}>
                <Controller
                  name="name"
                  control={control}
                  defaultValue=""
                  rules={{ required: "Le nom est requis" }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="Nom"
                      error={!!errors.name}
                      helperText={errors.name?.message}
                    />
                  )}
                />
              </Grid>

              {/* Email */}
              <Grid item xs={12}>
                <Controller
                  name="email"
                  control={control}
                  defaultValue=""
                  rules={{
                    required: "L'email est requis",
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "Email invalide",
                    },
                  }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="Email"
                      type="email"
                      error={!!errors.email}
                      helperText={errors.email?.message}
                    />
                  )}
                />
              </Grid>

              {/* Téléphone */}
              <Grid item xs={12}>
                <Controller
                  name="phone"
                  control={control}
                  defaultValue=""
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="Téléphone"
                      error={!!errors.phone}
                      helperText={errors.phone?.message}
                    />
                  )}
                />
              </Grid>

              {/* Genre */}
              <Grid item xs={12}>
                <Controller
                  name="sexe"
                  control={control}
                  defaultValue="homme"
                  rules={{ required: "Le genre est requis" }}
                  render={({ field }) => (
                    <FormControl
                      component="fieldset"
                      error={!!errors.sexe}
                      fullWidth
                    >
                      <FormLabel component="legend">Genre</FormLabel>
                      <RadioGroup {...field} row>
                        <FormControlLabel
                          value="homme"
                          control={<Radio />}
                          label="Homme"
                        />
                        <FormControlLabel
                          value="femme"
                          control={<Radio />}
                          label="Femme"
                        />
                      </RadioGroup>
                      {errors.sexe && (
                        <FormHelperText>{errors.sexe.message}</FormHelperText>
                      )}
                    </FormControl>
                  )}
                />
              </Grid>

              {/* Boutons */}
              <Grid item xs={12}>
                <Box display="flex" gap={2}>
                  <Button
                    type="submit"
                    variant="contained"
                    startIcon={<SaveIcon />}
                    fullWidth
                    size="large"
                  >
                    Enregistrer
                  </Button>
                  <Button
                    variant="outlined"
                    startIcon={<CancelIcon />}
                    fullWidth
                    size="large"
                    onClick={handleCancel}
                  >
                    Annuler
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
}
