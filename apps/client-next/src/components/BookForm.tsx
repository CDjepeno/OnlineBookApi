"use client";
import "react-datepicker/dist/react-datepicker.css";
import { Controller, useForm } from "react-hook-form";
import FormInput from "@/components/FormInput";
import { Container, Grid2, TextField } from "@mui/material";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import Typography from "@mui/material/Typography";
import "react-datepicker/dist/react-datepicker.css";
import { DevTool } from "@hookform/devtools";
import { useEffect, useRef, useState } from "react";
import DatePicker from "react-datepicker";
import Image from "next/image";
import {
  GlobalStyle,
  IconWithMargin,
  StyledButton,
} from "@/styledComponents/styledComponent";
import { BookFormData } from "@/types/book/form.types";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";



// const GlobalStyle = createGlobalStyle`
//   .react-datepicker-wrapper,
//   .react-datepicker__input-container {
//     width: 100%;
//   }
// `;



export interface BookFormProps {
  title: string;
  button: string;
  onSubmit: (data: BookFormData) => void;
  bookUpdate?: BookFormData;
}

function BookForm({
  title,
  onSubmit,
  button,
  bookUpdate,
}: BookFormProps) {
  const [fileName, setFileName] = useState(bookUpdate?.coverUrl || "");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      setFileName(URL.createObjectURL(selectedFile));
    }
  };

  const bookSchema = yup.object({
    title: yup.string().required("Le titre doit être renseigné"),
    description: yup.string().required("La description doit être renseignée"),
    author: yup.string().required("L'auteur doit être renseigné"),
    releaseAt: yup.string().required("La date de sortie doit être renseignée"),
    coverUrl: yup
      .mixed<File | string>()
      .required("L'image de couverture est requise")
      .test("fileSize", "L'image doit faire moins de 5MB", (value) =>
        value instanceof File ? value.size <= 2000000 : true
      ),
  });

  const {
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<BookFormData>({
    defaultValues: bookUpdate ?? undefined,
    resolver: yupResolver(bookSchema),
  });

    useEffect(() => {
      reset(bookUpdate || undefined);
      setFileName(bookUpdate?.coverUrl || "");
    }, [bookUpdate, reset]);

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
          {title}
        </Typography>
        <Box
          component="form"
          noValidate
          onSubmit={handleSubmit(onSubmit)}
          sx={{ mt: 3 }}
        >
          <Grid2 container spacing={2}>
            <Grid2 columns={{ xs: 12 }} component="div" sx={{ width: "100%" }}>
              <FormInput
                name="title"
                label="Titre"
                control={control}
                errors={errors}
                fullWidth
              />
            </Grid2>
            <Grid2 columns={{ xs: 12 }} component="div" sx={{ width: "100%" }}>
              <FormInput
                name="description"
                label="Description"
                control={control}
                errors={errors}
              />
            </Grid2>
            <Grid2 columns={{ xs: 12 }} component="div" sx={{ width: "100%" }}>
              <FormInput
                name="author"
                label="Auteur"
                control={control}
                errors={errors}
              />
            </Grid2>
            <Grid2 columns={{ xs: 12 }} component="div" sx={{ width: "100%" }}>
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
            </Grid2>
            <Grid2 columns={{ xs: 12 }} component="div" sx={{ width: "100%" }}>
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
                          <Image
                            src={fileName}
                            alt="Preview"
                            width={200}
                            height={200}
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
            </Grid2>
          </Grid2>

          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            {button}
          </Button>
        </Box>
      </Box>

      <DevTool control={control} />
    </Container>
  );
}

export default BookForm;
