import { Button } from "@mui/material";
import SettingsIcon from '@mui/icons-material/Settings';

// Props que o EditarPerfilButton vai receber..
type EditarPerfilButtonProps = {
    atualizarEstado: React.Dispatch<React.SetStateAction<boolean>>
}

// Função que renderiza o componente
export function EditarPerfilButton({ atualizarEstado }: EditarPerfilButtonProps) {

    // Handler que usa o onClick do button para atualizar o estado de aparecer/desaparecer do popup
    const handleClick = () => {
        atualizarEstado(true)
    }

    // Cores baseadas no design de referência (Tailwind blue-600 e blue-500)
    const primaryBlue = "#2563EB"; 
    const hoverBlue = "#3B82F6"; 

    // renderização do componente
    return (
        <Button
            onClick={handleClick}
            sx={{
                // Fundo azul sólido (replicando bg-blue-600)
                background: primaryBlue, 
                
                // Removido o borderRadius customizado para o MUI lidar com isso
                // O MUI padrão usa um pequeno borderRadius (geralmente 4px)
                // borderRadius: "9999px", // <--- REMOVIDO
                
                color: "white", // Texto branco (replicando text-white)

                // Tamanho de fonte e peso reduzidos (tornando o botão menor)
                fontSize: "0.85em", // Reduzido de 0.875em
                fontWeight: 600,

                display: "flex",
                alignItems: "center",
                // Espaçamento reduzido (tornando o botão menor)
                gap: "0.4em", // Reduzido de 0.5em
                textTransform: "none",
                padding: "0.5em 1em", // Reduzido de 0.75em 1.5em

                // Transição suave para o efeito de escala e cor
                transition: "all 300ms ease-in-out", 

                // Adicionando a sombra azul
                boxShadow: `0 5px 8px -3px rgba(59, 130, 246, 0.4), 0 2px 4px -1px rgba(59, 130, 246, 0.2)`, // Sombra um pouco menor
                
                // Estilos de hover: cor mais clara e escala
                '&:hover': {
                    background: hoverBlue,
                    transform: "scale(1.02)",
                    // Aumenta a sombra no hover
                    boxShadow: `0 8px 12px -3px rgba(59, 130, 246, 0.5), 0 4px 6px -2px rgba(59, 130, 246, 0.3)`,
                    // Garantindo que o MUI não use um background diferente no hover
                    backgroundColor: hoverBlue,
                },
                // Estilo para o foco (acessibilidade, replicando focus:ring-4)
                 '&:focus': {
                    outline: `4px solid ${hoverBlue}`,
                    outlineOffset: '2px',
                    background: hoverBlue,
                 }
            }}
        >
            {/* Componente svg que engranem, melhora o desing e intuitividade do site */}
            <SettingsIcon sx={{ fontSize: "1.1em" }} />Editar perfil
        </Button>
    )
}