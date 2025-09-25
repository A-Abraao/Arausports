import { Button } from "@mui/material";
import PersonAddIcon from '@mui/icons-material/PersonAdd';

export function AdicionarAmigo() {
    return (
        <Button
        sx={{
            background: "dodgerblue",
            borderRadius: "0.35em",
            color: "white",
            display: "flex",
            fontSize: "0.85em",
            alignItems: "center",
            gap: "0.65em",
            textTransform: "none",
            padding: "0.45em 0.6em",
        }}
        >
            <PersonAddIcon fontSize="small"/>
            Add amigo
        </Button>
    )
}