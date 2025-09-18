import { TextField, InputAdornment } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

function SearchBarMui({ placeholder = "Search...", onChange }: { placeholder?: string; onChange?: (value: string) => void }) {
  return (
    <TextField
        type="search"
        placeholder={placeholder}
        onChange={(e) => onChange?.(e.target.value)}
        variant="outlined"
        
        InputProps={{
            startAdornment: (
            <InputAdornment position="start">
                <SearchIcon sx={{ fontSize: 18, color: "text.secondary" }} />
            </InputAdornment>
            ),
        }}
        sx={{
            "& .MuiOutlinedInput-root": {
                borderRadius: "0.5rem", // curva da borda
                fontSize: "0.875rem",   // tamanho da fonte viado
                fontWeight: "480",
                width: "100%",
                paddingRight: "0.75rem", // padding na direita
                paddingLeft: "0.25rem",  // compensar o ícone
                backgroundColor: "background.paper", // bg-background
                "& fieldset": {
                    borderColor: "divider", // border-input
                },
                
                "&:hover fieldset": {
                    borderColor: "transparent !important",
                },

                "&.Mui-focused fieldset": {
                    borderWidth: 3,
                    borderColor: "var(--ring)", // focus-visible:ring
                },

                "&.Mui-focused:hover fieldset": {
                    borderColor: "var(--ring) !important", 
                },
            },
            "& input": {
            padding: "0.5rem 0", // padding
            },
            "& .MuiInputAdornment-root": {
            marginRight: "0.25rem",
            },
        }}
        />
    );
}

export default SearchBarMui;
