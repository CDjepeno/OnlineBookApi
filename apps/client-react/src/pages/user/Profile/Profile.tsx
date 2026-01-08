import { funEmoji, lorelei } from "@dicebear/collection";
import { createAvatar } from "@dicebear/core";
import EmailIcon from "@mui/icons-material/Email";

import PersonIcon from "@mui/icons-material/Person";
import PhoneIcon from "@mui/icons-material/Phone";

import {
  Avatar,
  Box,
  Card,
  Chip,
  CircularProgress,
  Container,
  Grid,
  Typography,
} from "@mui/material";
import { ProfileHook } from "./Profile.hook";

export function Profile() {
  const { user, isLoading, error } = ProfileHook();

  if (isLoading) {
    return (
      <Container sx={{ mt: 4, textAlign: "center" }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error) {
    return (
      <Container sx={{ mt: 4, textAlign: "center" }}>
        <Typography variant="h6" color="error">
          Erreur lors du chargement du profil
        </Typography>
      </Container>
    );
  }

  if (!user) {
    return (
      <Container sx={{ mt: 4, textAlign: "center" }}>
        <Typography variant="h6">Aucun utilisateur trouvé</Typography>
      </Container>
    );
  }

  const avatarDataUri =
    user.sexe === "homme"
      ? createAvatar(funEmoji, { seed: user.name, size: 64 }).toDataUri()
      : createAvatar(lorelei, { seed: user.name, size: 64 }).toDataUri();

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card sx={{ textAlign: "center", p: 3 }}>
            <Avatar
              src={avatarDataUri}
              alt={user.name}
              sx={{
                width: 150,
                height: 150,
                margin: "0 auto",
                mb: 2,
              }}
            />
            <Typography variant="h5" gutterBottom>
              {user.name}
            </Typography>
            <Chip
              label={user.sexe === "homme" ? "Homme" : "Femme"}
              color="primary"
              size="small"
              sx={{ mb: 2 }}
            />
          </Card>
        </Grid>

        <Grid item xs={12} md={8}>
          <Card sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Informations personnelles
            </Typography>
            <Box sx={{ mt: 2 }}>
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <PersonIcon sx={{ mr: 2, color: "primary.main" }} />
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Nom
                  </Typography>
                  <Typography variant="body1">{user.name}</Typography>
                </Box>
              </Box>

              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <EmailIcon sx={{ mr: 2, color: "primary.main" }} />
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Email
                  </Typography>
                  <Typography variant="body1">{user.email}</Typography>
                </Box>
              </Box>

              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <PhoneIcon sx={{ mr: 2, color: "primary.main" }} />
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Téléphone
                  </Typography>
                  <Typography variant="body1">
                    {user.phone || "Non renseigné"}
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
}
