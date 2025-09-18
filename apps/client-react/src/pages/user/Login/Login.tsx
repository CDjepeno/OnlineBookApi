import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import Grid from "@mui/material/Grid";
import Link from "@mui/material/Link";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import { GoogleLogin } from "@react-oauth/google";
import FormInput from "../../../components/FormInput";
import LoginGoogleHook from "./Login-google.hook";
import LoginHook from "./Login.hook";

export default function Login() {
  const { onSubmit, handleSubmit, errors, isSubmitting, control } = LoginHook();
  const { handleGoogleLogin } = LoginGoogleHook();

  return (
    <Grid container component="main" sx={{ height: "100vh" }} maxWidth="xs">
      <Grid
        item
        xs={false}
        sm={4}
        md={7}
        sx={{
          backgroundImage: "url(https://source.unsplash.com/random?wallpapers)",
          backgroundRepeat: "no-repeat",
          backgroundColor: (t) =>
            t.palette.mode === "light"
              ? t.palette.grey[50]
              : t.palette.grey[900],
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
      <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
        <Box
          sx={{
            my: 8,
            mx: 4,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>
          <Box
            component="form"
            noValidate
            onSubmit={handleSubmit(onSubmit)}
            sx={{ mt: 3 }}
          >
            <FormInput
              name="email"
              label="Email"
              control={control}
              errors={errors}
              sx={{ mb: 2 }}
            />

            <FormInput
              name="password"
              label="Mot de passe"
              type="password"
              control={control}
              errors={errors}
              sx={{ mb: 2 }}
            />
            <FormControlLabel
              control={<Checkbox value="remember" color="primary" />}
              label="Se souvenir de moi"
            />
            {errors.root && <p>{errors.root.message}</p>}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={isSubmitting}
            >
              Se Connecter
            </Button>
          </Box>

          <Typography sx={{ mt: 2, mb: 1 }}>ou</Typography>

          <GoogleLogin
            onSuccess={(credentialResponse) => {
              if (credentialResponse.credential) {
                handleGoogleLogin({ idToken: credentialResponse.credential });
              }
            }}
            onError={() => {
              console.error("Erreur lors du login Google");
            }}
          />

          <Grid container sx={{ mt: 2 }}>
            <Grid item xs>
              <Link href="#" variant="body2">
                Mot de passe oublié ?
              </Link>
            </Grid>
            <Grid item>
              <Link href="/register" variant="body2">
                {"Vous n'avez pas de compte ? Inscrivez-vous"}
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Grid>
    </Grid>
  );
}
