import LinearProgress from '@mui/material/LinearProgress';
import Box from '@mui/material/Box';

export function BarraDeProgresso({ valor }: { valor: number }) {
  return (
    <Box sx={{
        width: '100%',
        
    }}>
      <LinearProgress 
        variant="determinate" 
        value={valor} 
        sx={{
          height: "0.55em", // altura da barra
          borderRadius: "0.5em", // Arredonda os cantos
          
          // cor de fundo da barra
          backgroundColor: '#FFFFE0',


          '& .MuiLinearProgress-bar': {
            backgroundColor: 'var(--ring)', // cor da varra de progresso rapá
          },
        }}
        />
    </Box>
  );
}