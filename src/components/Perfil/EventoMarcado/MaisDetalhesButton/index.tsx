import { Button } from "@mui/material";

export function MaisDetalhesButton() {
    return (
        <Button sx={{
            background:"var(--gradient-hero)", 
            textTransform: "none",
            padding: "0.5em",
            color: "white",
        }}>
            Mais detalhes
        </Button>
    )
}