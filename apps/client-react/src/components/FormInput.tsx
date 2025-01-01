import TextField, { TextFieldProps } from "@mui/material/TextField";
import React from "react";
import {
  Control,
  Controller,
  ControllerFieldState,
  ControllerRenderProps,
  FieldErrors,
  FieldValues,
  Path,
  UseFormStateReturn,
} from "react-hook-form";

interface FormInputProps<T extends FieldValues>
  extends Omit<TextFieldProps, "name" | "label" | "control" | "errors"> {
  name: Path<T>;
  label: string;
  control: Control<T>;
  errors: FieldErrors<T>;
  type?: string;
  onBlur?: () => void;
  customField?: (fieldProps: {
    field: ControllerRenderProps<T, Path<T>>;
    fieldState: ControllerFieldState;
    formState: UseFormStateReturn<T>;
  }) => React.ReactNode;
}

function FormInput<T extends FieldValues>({
  name,
  label,
  control,
  errors,
  type = "text",
  onBlur,
  customField,
  ...props
}: FormInputProps<T>) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState, formState }) => {
        if (customField) {
          const customFieldResult = customField({ field, fieldState, formState });
          if (React.isValidElement(customFieldResult)) {
            return customFieldResult;
          }

          // Si customField ne retourne pas un élément valide
          console.error("The customField function must return a valid React element.");
          return <></>; // Retourne un fragment vide comme fallback
        }

        // Retourner toujours un élément React valide
        return (
          <TextField
            {...field}
            {...props}
            label={label}
            fullWidth
            required
            type={type}
            error={!!errors[name]}
            helperText={errors[name] ? (errors[name]?.message as string) : null}
            onBlur={onBlur}
          />
        );
      }}
    />
  );
}

export default FormInput;
