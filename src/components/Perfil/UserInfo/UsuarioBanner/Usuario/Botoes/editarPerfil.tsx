import { Button } from "@mui/material";
import EngrenagemSvg from '../../../../../../assets/img/engrenagem.svg?react'

type EditarPerfilButtonProps = {
    atualizarEstado: React.Dispatch<React.SetStateAction<boolean>>
}

export function EditarPerfilButton({ atualizarEstado }: EditarPerfilButtonProps) {

    const handleClick = () => {
        atualizarEstado(true)
    }

    return (
        <Button
            onClick={handleClick}
            sx={{
                background: "var(--secondary)",
                borderRadius: "0.35em",
                color: "white",
                fontSize: "0.85em",
                display: "flex",
                alignItems: "center",
                gap: "0.65em",
                textTransform: "none",
                padding: "0.45em 0.6em",
            }}
        >
            <EngrenagemSvg height={"1.75em"} width={"1.75em"}/>Editar perfil
        </Button>
    )
}