import { useState } from "react";
import { TextField } from "@mui/material";


function EmailInput() {

    //estado para guardar o email digitado pelo usuario
    const [valorEmail, setValorEmail] = useState("")
    const [erroEmail, setErroEmail] = useState(false)
    
    //função que pega o valor e guarda lá no estado
    const handleSetValorEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
        setValorEmail(e.target.value);
    };

    return (
        <TextField
        value={valorEmail}
        label="Email"
        variant="outlined"
        onChange={handleSetValorEmail}
        sx={{
            "& .MuiOutlinedInput-root": {

                "& .MuiInputBase-input": {
                    fontWeight: 550, // aplica bold no texto digitado
                },
                "& fieldset": {
                    //esses são os estilos primários da parada, eles só mudam quando um evento como o hoover ocorre
                    borderColor: "rgba(0, 0, 0, 0.4)", 
                    transition: "border-color 0.2s ease-in-out",
                    
                },
                "&:hover fieldset": {
                    //hoover né pae. Aqui os estilos só são aplicados quando o mouse ta em cima
                    background: "rgba(180,180,180, 0.1)",
                    borderColor: "rgba(0, 0, 0, 0.4)",
                },
                "&.Mui-focused fieldset": {
                    //e por fim é o active ou onclick, são estilos que dependem do click para funcionarem
                    borderColor: "rgba(0, 0, 0, 0.4)", 
                    borderWidth: "0.10em"
                },
            },
        }}
        InputLabelProps={{
            //aki é onde os estilos da label começam a funcionar
            sx: {
            
                fontWeight: "500",
                color: "rgba(0, 0, 0, 0.8)",

            //estilos da label só que o onclick ativo na parada
            "&.Mui-focused": {
                color: "rgba(0,0,0,0.6)",
            },
            },
        }}
        />
    )
}

export default EmailInput