import { DevTool } from "@hookform/devtools";
import {
  Box,
  Button,
  Container,
  CssBaseline,
  Grid,
  TextField,
  Typography,
} from "@mui/material";
import { fr } from "date-fns/locale";
import { useEffect, useState } from "react";
import DatePicker, { registerLocale } from "react-datepicker";
import { Controller, useForm } from "react-hook-form";
import { BookForm } from "src/types/book/form.types";
import { createGlobalStyle } from "styled-components";
import FormInput from "../../../../components/FormInput";
import BookUpdateAddHook from "../BookAddUpdate.hook";

registerLocale("fr", fr);

const GlobalStyle = createGlobalStyle`
  .react-datepicker-wrapper,
  .react-datepicker__input-container {
    width: 100%;
  }
`;

type BookUpdateFormProps = {
  bookUpdate: BookForm;
  setIsFormUpdateBookOpen: (value: boolean) => void;
};

function BookUpdateForm({
  bookUpdate,
  setIsFormUpdateBookOpen,
}: BookUpdateFormProps) {
  const [fileName, setFileName] = useState(bookUpdate?.coverUrl || "");

  const {
    control,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm<BookForm>({
    defaultValues: {
      ...bookUpdate,
      coverUrl: bookUpdate.coverUrl,
    },
  });

  useEffect(() => {
    reset(bookUpdate);
    setFileName(bookUpdate?.coverUrl || "");
  }, [bookUpdate, reset]);

  const { submit } = BookUpdateAddHook(setIsFormUpdateBookOpen);

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <GlobalStyle />

      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Typography variant="h6" component="h2" gutterBottom>
          Mettre à jour un Livre
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
                  render={({ field: { onChange, ref } }) => (
                    <>
                      <input
                        type="file"
                        id="file-upload"
                        accept=".jpg,.jpeg,.png"
                        onChange={(e) => {
                          if (e.target.files && e.target.files.length > 0) {
                            const selectedFile = e.target.files;
                            onChange(selectedFile);
                            setFileName(selectedFile[0].name);
                          }
                        }}
                        ref={ref}
                        style={{ width: "100%" }}
                      />
                      {fileName && typeof fileName === "string" && (
                        <Typography variant="body2" mt={2}>
                          Fichier actuel : {fileName}
                        </Typography>
                      )}
                    </>
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
            Mettre à jour
          </Button>
        </Box>
      </Box>

      <DevTool control={control} />
    </Container>
  );
}

export default BookUpdateForm;
