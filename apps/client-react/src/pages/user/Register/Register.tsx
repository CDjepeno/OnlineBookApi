import { yupResolver } from "@hookform/resolvers/yup";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { FormControl, IconButton, InputAdornment, InputLabel, MenuItem, Select } from "@mui/material";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Link from "@mui/material/Link";
import Typography from "@mui/material/Typography";
import { Controller, useForm } from "react-hook-form";
import { UserForm } from "src/types/user/form.types";
import FormInput from "../../../components/FormInput";
import UserUpdateRegisterHook from "../UserUpdateRegister.hook";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useState } from "react";

export default function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { onSubmit, signupSchema } = UserUpdateRegisterHook();


  const {
    handleSubmit,
    setError,
    watch,
    control,
    formState: { errors, isSubmitting },
  } = useForm<UserForm>({ resolver: yupResolver(signupSchema) });

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
            <Grid item xs={12}>
              <FormInput
                name="name"
                label="Name"
                control={control}
                errors={errors}
              />
              {errors.name && (
                <small style={{ color: "red" }}>{errors.name.message}</small>
              )}
            </Grid>
            <Grid item xs={12}>
              <FormInput
                name="email"
                label="Email Address"
                errors={errors}
                control={control}
              />

              {errors.email && (
                <small style={{ color: "red" }}>{errors.email.message}</small>
              )}
            </Grid>
            <Grid item xs={12}>
              <FormInput
                name="phone"
                label="Phone"
                control={control}
                errors={errors}
              />
              {errors.phone && (
                <small style={{ color: "red" }}>{errors.phone.message}</small>
              )}
            </Grid>
            <Grid item xs={12}>
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
            </Grid>
            <Grid item xs={12}>
              <FormInput
                name="password"
                label="password"
                type={showPassword ? "text" : "password"}
                control={control}
                onBlur={() => handleConfirmPasswordChange}
                errors={errors}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <FormInput
                name="confirmPassword"
                label="Confirm Password"
                type={showConfirmPassword ? "text" : "password"} 
                control={control}
                errors={errors}
                onBlur={handleConfirmPasswordChange}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setShowConfirmPassword(!showConfirmPassword)} edge="end">
                        {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
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
            Sign Up
          </Button>
          <Grid container justifyContent="flex-end">
            <Grid item>
              <Link href="/login" variant="body2">
                Already have an account? Sign in
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Container>
  );
}
