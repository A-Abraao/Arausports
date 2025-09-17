import { useState } from "react";
import { Snackbar, Alert, Button } from "@mui/material";

function AlertaPopup() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button variant="contained" onClick={() => setOpen(true)}>
        Mostrar alerta
      </Button>

      <Snackbar
        open={open}
        autoHideDuration={4000} // fecha sozinho depois de 4s
        onClose={() => setOpen(false)}
        anchorOrigin={{ vertical: "top", horizontal: "right" }} // posição do popup
      >
        <Alert 
          onClose={() => setOpen(false)} 
          severity="warning" 
          sx={{ width: "100%" }}
        >
          ⚠️ Atenção: algo deu errado!
        </Alert>
      </Snackbar>
    </>
  );
}

export default AlertaPopup;
