import { Button } from "@mui/material";
import EngrenagemSvg from '../../../../../../assets/img/engrenagem.svg?react'

export function EditarPerfilButton() {
    return (
        <Button
            sx={{
                background: "var(--secondary)",
                borderRadius: "0.35em",
                color: "white",
                fontSize: "0.85em",
                display: "flex",
                alignItems: "center",
                gap: "0.65em",
                textTransform: "none",
                padding: "0.7em 0.75em",
            }}
        >
            <EngrenagemSvg height={"1.75em"} width={"1.75em"}/>Editar perfil
        </Button>
    )
}