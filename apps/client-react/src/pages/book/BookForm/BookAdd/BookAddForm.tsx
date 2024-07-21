import { DevTool } from "@hookform/devtools";
import { Container, TextField } from "@mui/material";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import { fr } from "date-fns/locale";
import { useRef, useState } from "react";
import DatePicker, { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Controller } from "react-hook-form";
import FormInput from "../../../../components/FormInput";
import {
  GlobalStyle,
  IconWithMargin,
  StyledButton,
} from "../../../../StyledComponents/StyledComponents";
import AddBookHook from "./BookAdd.hook";

registerLocale("fr", fr);

function BookAddForm() {
  const [fileName, setFileName] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { submit, handleSubmit, errors, control } = AddBookHook();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      setFileName(URL.createObjectURL(selectedFile));
    }
  };
  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <GlobalStyle />

      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Typography component="h1" variant="h5">
          Ajouter un Livre
        </Typography>
        <Box
          component="form"
          noValidate
          onSubmit={handleSubmit(submit)}
          sx={{ mt: 3 }}
        >
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <FormInput
                name="name"
                label="Nom"
                control={control}
                errors={errors}
              />
            </Grid>
            <Grid item xs={12}>
              <FormInput
                name="description"
                label="Description"
                control={control}
                errors={errors}
              />
            </Grid>
            <Grid item xs={12}>
              <FormInput
                name="author"
                label="Auteur"
                control={control}
                errors={errors}
              />
            </Grid>

            <Grid item xs={12}>
              <Controller
                name="releaseAt"
                control={control}
                render={({ field: { onChange, value, ref } }) => (
                  <DatePicker
                    selected={value ? new Date(value) : null}
                    onChange={onChange}
                    ref={ref}
                    locale="fr"
                    dateFormat="dd/MM/yyyy"
                    customInput={
                      <TextField
                        fullWidth
                        label="Date de parution"
                        error={!!errors.releaseAt}
                        helperText={
                          errors.releaseAt ? errors.releaseAt.message : ""
                        }
                      />
                    }
                  />
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <Box
                sx={{
                  width: "100%",
                  padding: "15px",
                  border: errors.coverUrl ? "1px solid red" : "1px solid #bbb",
                  borderRadius: "5px",
                }}
              >
                <Controller
                  name="coverUrl"
                  control={control}
                  render={({ field: { onChange } }) => (
                    <Box>
                      <input
                        type="file"
                        id="file-upload"
                        accept=".jpg,.jpeg,.png"
                        onChange={(e) => {
                          handleFileChange(e);
                          onChange(e.target.files && e.target.files[0]);
                        }}
                        ref={fileInputRef}
                        style={{ display: "none" }}
                      />
                      <StyledButton
                        variant="contained"
                        onClick={() =>
                          fileInputRef.current && fileInputRef.current.click()
                        }
                      >
                        <IconWithMargin />
                        Choisir un fichier
                      </StyledButton>
                      {fileName && typeof fileName === "string" && (
                        <Typography variant="body2" mt={2}>
                          <img
                            src={fileName}
                            alt="Preview"
                            style={{
                              width: "100%",
                              maxHeight: "120px",
                              borderRadius: 7,
                            }}
                          />
                        </Typography>
                      )}
                    </Box>
                  )}
                />
              </Box>
              {errors.coverUrl && (
                <Typography color="error" m="4px 15px" variant="body2">
                  {errors.coverUrl.message}
                </Typography>
              )}
            </Grid>
          </Grid>

          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Ajouter un livre
          </Button>
        </Box>
      </Box>

      <DevTool control={control} />
    </Container>
  );
}

export default BookAddForm;
