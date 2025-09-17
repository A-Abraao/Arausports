import { TextField } from "@mui/material";

//aqui criamos a tipagem do tipo de dado que o email input var receber
type SenhaInputProps = {
  value: string;
  onChange: (value: string) => void;
}

function InputSenha({value, onChange}: SenhaInputProps) {
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value); // transforma o valor em string quando for usado no input
  };

  return (
    <TextField
      value={value}
      label="Senha"
      type="password"
      variant="outlined"
      onChange={handleChange}
      sx={{
        "& .MuiOutlinedInput-root": {
          "& .MuiInputBase-input": {
            fontWeight: 550, // aplica bold no texto digitado
          },
          "& fieldset": {
            //estilos primários que são definidos e ficam lá para sempre, mudam apenas quando ocorre algum evento tipo o hoover
            borderColor: "rgba(0, 0, 0, 0.4)",
            transition: "border-color 0.2s ease-in-out",
          },
          "&:hover fieldset": {
            background: "rgba(180,180,180,0.1)", //esse aqui define a cor de fundo quando o mouse passar 
            borderColor: "rgba(0, 0, 0, 0.4)", //cor da borda quando mouse passar
          },
          "&.Mui-focused fieldset": {
            //estilos que vão aplicados quando o usuario clickar na parada
            borderColor: "rgba(0, 0, 0, 0.4)",
            borderWidth: "0.10em",
          },
        },
      }}
      InputLabelProps={{
        sx: {
          fontWeight: "500",
          color: "rgba(0, 0, 0, 0.8)",
          "&.Mui-focused": {
            color: "rgba(0, 0, 0, 0.6)",
          },
        },
      }}
    />
  );
}

export default InputSenha;
