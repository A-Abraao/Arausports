import { TextField } from "@mui/material";

type SenhaInputProps = {
  value: string;
  onChange: (value: string) => void;
}

function InputSenha({value, onChange}: SenhaInputProps) {
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  return (
    <TextField
      value={value}
      label="Senha"
      type="password"
      variant="outlined"
      fullWidth
      onChange={handleChange}
      size="small"
      sx={{
        "& .MuiOutlinedInput-root": {
          height: 45,
          "& .MuiInputBase-input": {
            fontSize: "0.95rem", 
            padding: "8px 10px",
          },
        },
      }}
      InputLabelProps={{
        sx: {
          fontSize: "0.9rem", 
        },
      }}
    />
  );
}

export default InputSenha;
