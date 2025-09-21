import { Button } from "@mui/material";
import PersonAddIcon from '@mui/icons-material/PersonAdd';

export function AdicionarAmigo() {
    return (
        <Button
        sx={{
            background: "dodgerblue",
            borderRadius: "0.5em",
            color: "white",
            display: "flex",
            alignItems: "center",
            gap: "0.65em",
            textTransform: "none",
            padding: "0.5em 0.75em",
        }}
        >
            <PersonAddIcon fontSize="small"/>
            Add amigo
        </Button>
    )
}