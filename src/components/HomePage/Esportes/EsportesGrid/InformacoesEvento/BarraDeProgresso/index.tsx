import LinearProgress from '@mui/material/LinearProgress';
import Box from '@mui/material/Box';
import React from 'react';

type BarraDeProgressoProps = {
  valor?: number | null; // 0..100
  'aria-label'?: string;
};

export function BarraDeProgresso({ valor = 0, 'aria-label': ariaLabel }: BarraDeProgressoProps) {
  // normaliza valor: garante número finito entre 0 e 100
  const raw = typeof valor === 'number' && Number.isFinite(valor) ? valor : 0;
  const clamped = Math.max(0, Math.min(100, Math.round(raw)));

  return (
    <Box
      sx={{
        width: '100%',
      }}
      role="region"
      aria-label={ariaLabel ?? 'Barra de progresso de participantes'}
    >
      <LinearProgress
        variant="determinate"
        value={clamped}
        sx={{
          height: '0.55em',
          borderRadius: '0.5em', //arredonda as bordar
          backgroundColor: 'rgba(250, 169, 56, 0.2)', //cor de fundo da barra
          // transição suave na barra interna
          '& .MuiLinearProgress-bar': {
            backgroundImage: 'var(--gradient-primary)', //cor da barra de progresso rapá
            transition: 'transform 300ms linear, width 300ms linear',
          },
        }}
      />
    </Box>
  );
}
