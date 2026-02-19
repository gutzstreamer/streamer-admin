import React from "react";
import { InputProps, useInput } from "react-admin";
import { Box, Button } from "@mui/material";

type DatePresetValue = "" | "today" | "7d" | "30d";

interface DatePresetInputProps extends Omit<InputProps, "source"> {
  source: string;
  label?: string;
}

const options: Array<{ value: DatePresetValue; label: string }> = [
  { value: "", label: "Todos" },
  { value: "today", label: "Hoje" },
  { value: "7d", label: "7d" },
  { value: "30d", label: "30d" },
];

export const DatePresetInput: React.FC<DatePresetInputProps> = ({
  source,
  label = "Período",
  ...rest
}) => {
  const { field, isDisabled } = useInput({
    source,
    ...rest,
  });

  const currentValue = (field.value as DatePresetValue | undefined) ?? "";

  return (
    <Box
      sx={{
        display: "inline-flex",
        alignItems: "center",
        gap: 0.75,
        flexWrap: "wrap",
      }}
    >
      <Box
        component="span"
        sx={{
          fontSize: 12,
          fontWeight: 700,
          color: "text.secondary",
          letterSpacing: "0.02em",
        }}
      >
        {label}
      </Box>

      <Box sx={{ display: "inline-flex", gap: 0.5, flexWrap: "wrap" }}>
        {options.map((option) => {
          const selected = currentValue === option.value;

          return (
            <Button
              key={option.value || "all"}
              size="small"
              disableElevation
              disabled={isDisabled}
              onClick={() => field.onChange(option.value)}
              sx={{
                minWidth: 0,
                height: 26,
                px: 1.15,
                borderRadius: "999px",
                fontSize: 11.5,
                fontWeight: 700,
                lineHeight: 1,
                textTransform: "none",
                border: "1px solid",
                borderColor: selected ? "#9c27b0" : "rgba(156, 39, 176, 0.35)",
                color: selected ? "#ffffff" : "#cdb9e8",
                background: selected
                  ? "linear-gradient(135deg, #9c27b0 0%, #7b1fa2 100%)"
                  : "rgba(156, 39, 176, 0.08)",
                boxShadow: selected
                  ? "0 0 0 1px rgba(156, 39, 176, 0.35), 0 6px 14px rgba(123, 31, 162, 0.35)"
                  : "none",
                "&:hover": {
                  borderColor: "#9c27b0",
                  background: selected
                    ? "linear-gradient(135deg, #a63ac0 0%, #8a2cb5 100%)"
                    : "rgba(156, 39, 176, 0.16)",
                },
              }}
            >
              {option.label}
            </Button>
          );
        })}
      </Box>
    </Box>
  );
};
