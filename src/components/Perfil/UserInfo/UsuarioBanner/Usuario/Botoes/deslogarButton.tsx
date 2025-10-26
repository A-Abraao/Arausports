import { useState } from "react";
import { Button } from "@mui/material";
import ConfirmLogoutDialog from "./confirmarSaídaPopup";

export function DeslogarBt() {
    //state para exibir o popup de confirmação
    const [open, setOpen] = useState(false);

    return (
        <>
        <Button
            onClick={(e) => {
            e.stopPropagation();
            setOpen(true);
            }}
            sx={{
            textTransform: "none",
            color: "white",
            background: "crimson",
            "&:hover": { background: "#b22222" }
            }}
        >
            Sair da conta
        </Button>

        <ConfirmLogoutDialog open={open} onClose={() => setOpen(false)} />
        </>
    );
}

export default DeslogarBt;
