import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';
import RoomIcon from '@mui/icons-material/Room';

type Props = {
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  onLocateClick?: () => void;
};

export default function BannerPesquisa({
  placeholder = 'Encontre rolês próximos..',
  value,
  onChange,
  onLocateClick,
}: Props) {
  return (
    <Box
        sx={{
          width: '100%',
          maxWidth: { xs: 170, sm: 330, md: 490 }, // deixar parada responsiva
          mx: 'auto',
          p: 2,
          borderRadius: 2,
          border: '1px solid rgba(255,255,255,0.2)',
          bgcolor: 'rgba(255,255,255,0.06)',
          backdropFilter: 'blur(6px)',
        }}
      >
      <Box sx={{ display: 'flex', gap: 1 }}>
        <Box sx={{ flex: 1 }}>
            <TextField
              fullWidth
              size="small"
              variant="outlined"
              value={value}
              onChange={(e) => onChange?.(e.target.value)}
              placeholder={placeholder}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start" sx={{ mr: 1 }}>
                    <SearchIcon sx={{ fontSize: 24, color: 'rgba(255,255,255,0.7)' }} />
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 1,
                  bgcolor: 'rgba(255,255,255,0.20)',
                  color: 'white',

                  // remove hover azul
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'rgba(255,255,255,0.12)',
                  },

                  // barra de pesquisa quando o cara clica lá
                  '&.Mui-focused': {
                    bgcolor: 'rgba(255,255,255,0.20)', 
                    boxShadow: '0 0 0 2px var(--ring)', 
                    borderColor: 'transparent', 
                  },

                  // placeholder
                  '& .MuiInputBase-input::placeholder': {
                    color: 'white',
                  },
                },

                // borda padrão
                '& .MuiOutlinedInput-notchedOutline': {
                  border: '1px solid rgba(255,255,255,0.12)',
                },

                '& .MuiOutlinedInput-input': {
                  padding: '0.58em 1em',
                },
              }}
            />
        </Box>

        <IconButton
          aria-label="locate"
          size="large"
          onClick={onLocateClick}
          sx={{
            borderRadius: '0.20em',
            background: 'dodgerblue',
            '&:hover': {
              background: '#1f6feb',
            },
          }}
        >
          <RoomIcon sx={{ fontSize: 18, color: 'white' }} />
        </IconButton>
      </Box>
    </Box>
  );
}
