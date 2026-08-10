import React from "react";
import { Box, Typography, TextField, InputAdornment } from "@mui/material";

export interface FormFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
  helperText?: string;
  endAdornment?: React.ReactNode;
  autoFocus?: boolean;
}

export default function FormField({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  helperText,
  endAdornment,
  autoFocus,
}: FormFieldProps) {
  return (
    <Box sx={{ minWidth: 0 }}>
      <Typography
        component="label"
        variant="body2"
        sx={{
          display: "block",
          mb: 0.75,
          fontWeight: 500,
          color: "text.primary",
        }}
      >
        {label}
      </Typography>
      <TextField
        fullWidth
        autoFocus={autoFocus}
        type={type}
        value={value}
        placeholder={placeholder}
        helperText={helperText}
        onChange={(e) => onChange(e.target.value)}
        slotProps={
          endAdornment
            ? { input: { endAdornment: <InputAdornment position="end">{endAdornment}</InputAdornment> } }
            : undefined
        }
        sx={{
          "& .MuiOutlinedInput-root": {
            borderRadius: 1.5,
            transition: "box-shadow 0.2s ease, border-color 0.2s ease",
          },
        }}
      />
    </Box>
  );
}
