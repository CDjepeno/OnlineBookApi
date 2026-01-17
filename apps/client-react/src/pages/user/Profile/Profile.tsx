import { funEmoji, lorelei } from "@dicebear/collection";
import { createAvatar } from "@dicebear/core";
import EmailIcon from "@mui/icons-material/Email";

import PersonIcon from "@mui/icons-material/Person";
import PhoneIcon from "@mui/icons-material/Phone";

import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import {
  Avatar,
  Box,
  Button,
  Card,
  Chip,
  CircularProgress,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import DeleteProfileHook from "./DeleteProfile.Hook";
import { ProfileHook } from "./Profile.hook";

export function Profile() {
  const navigate = useNavigate();
  const { user, isLoading, error } = ProfileHook();
  const { submit: deleteProfile, isDeleting } = DeleteProfileHook();

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const handleDeleteClick = () => {
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    await deleteProfile();
    setDeleteDialogOpen(false);
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
  };

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
        <Grid size={{ xs: 12, md: 4 }}>
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
            <Box
              sx={{ mt: 2, display: "flex", flexDirection: "column", gap: "2" }}
            >
              <Button
                variant="contained"
                color="primary"
                startIcon={<EditIcon />}
                onClick={() => navigate(`/profile/edit/${user.id}`)}
                fullWidth
              >
                Modifier mon profil
              </Button>

              {/* Bouton Supprimer */}
              <Button
                variant="outlined"
                color="error"
                startIcon={<DeleteIcon />}
                onClick={handleDeleteClick}
                disabled={isDeleting}
                fullWidth
              >
                {isDeleting ? "Suppression..." : "Supprimer mon compte"}
              </Button>
            </Box>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 8 }}>
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

      {/* Dialog de confirmation de suppression */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleDeleteCancel}
        aria-labelledby="delete-dialog-title"
        aria-describedby="delete-dialog-description"
      >
        <DialogTitle id="delete-dialog-title">
          Confirmer la suppression du compte
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="delete-dialog-description">
            ⚠️ <strong>Attention !</strong> Cette action est irréversible.
            <br />
            <br />
            En supprimant votre compte, vous perdrez :
            <ul>
              <li>Toutes vos informations personnelles</li>
              <li>Tous vos livres publiés</li>
              <li>Toutes vos réservations</li>
            </ul>
            Êtes-vous vraiment sûr de vouloir supprimer votre compte ?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel} color="primary" autoFocus>
            Annuler
          </Button>
          <Button
            onClick={handleDeleteConfirm}
            color="error"
            variant="contained"
            disabled={isDeleting}
          >
            {isDeleting ? "Suppression..." : "Supprimer définitivement"}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
