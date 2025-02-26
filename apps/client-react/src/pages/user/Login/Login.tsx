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
import LoginHook from "./Login.hook";
import FormInput from "../../../components/FormInput";
import OtpModal from "src/components/OtpModal";
import { useState } from "react";
import { LoginFormInput } from "src/types/user/input.types";

export default function Login() {
  const { onSubmitLogin, onSubmitVerifyOtp, handleSubmit, errors, isSubmitting, control } = LoginHook();
  const [openOtp, setOpenOtp] = useState(false); // État pour la modal OTP
  const [email, setEmail] = useState(""); // Sauvegarde l'email pour l'OTP

  const handleLogin = async (data: LoginFormInput) => {
    try {
      setEmail(data.email);
      onSubmitLogin(data)

      setOpenOtp(true); // Ouvrir la modal OTP

    } catch (error) {
      console.error(error);
      alert("Erreur de connexion ❌");
    }
  };

  const handleVerifyOtp = async (otp: string) => {
      onSubmitVerifyOtp({otp, email})
      setOpenOtp(false); // Fermer la modal après succès
  };

  return (
    <>
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
            onSubmit={handleSubmit(handleLogin)}
            sx={{ mt: 3 }}
          >
            <FormInput
              name="email"
              label="Email Address"
              control={control}
              errors={errors}
              sx={{ mb: 2 }}
            />

            <FormInput
              name="password"
              label="Password"
              type="password"
              control={control}
              errors={errors}
              sx={{ mb: 2 }}
            />
            <FormControlLabel
              control={<Checkbox value="remember" color="primary" />}
              label="Remember me"
            />
            {errors.root && <p>{errors.root.message}</p>}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={isSubmitting}
            >
              Sign In
            </Button>
            <Grid container>
              <Grid item xs>
                <Link href="#" variant="body2">
                  Forgot password?
                </Link>
              </Grid>
              <Grid item>
                <Link href="/register" variant="body2">
                  {"Don't have an account? Sign Up"}
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Grid>
    </Grid>
    <OtpModal open={openOtp} handleClose={() => setOpenOtp(false)} onVerify={handleVerifyOtp} />   
    </>
  );
}
