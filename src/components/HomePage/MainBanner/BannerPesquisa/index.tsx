import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';

type Props = {
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  onSearch?: (query: string) => void;
};

export default function BannerPesquisa({
  placeholder = 'Encontre rolês próximos..',
  value = "",
  onChange,
  onSearch,
}: Props) {
  const handleSearch = () => {
    if (onSearch) {
      onSearch(value);
    }
  };

  return (
    <Box
      sx={{
        width: '100%',
        /* garante um mínimo razoável e evita encurtamento extremo em telas pequenas */
        maxWidth: 'clamp(240px, 54vw, 640px)',
        mx: 'auto',
        p: 'clamp(0.4rem, 1.2vw, 0.9rem)',
        borderRadius: 'clamp(8px, 1.6vw, 12px)',
        border: '1px solid rgba(255,255,255,0.2)',
        bgcolor: 'rgba(255,255,255,0.06)',
        backdropFilter: 'blur(6px)',
        boxSizing: 'border-box',
      }}
    >
      <Box sx={{ display: 'flex', gap: 'clamp(0.45rem, 1.4vw, 0.95rem)', alignItems: 'center' }}>
        <Box sx={{ flex: 1, minWidth: '120px' }}>
          <TextField
            fullWidth
            size="small"
            variant="outlined"
            value={value}
            onChange={(e) => onChange?.(e.target.value)}
            placeholder={placeholder}
            InputProps={{
              startAdornment: (
                <InputAdornment
                  position="start"
                  sx={{ mr: 'clamp(6px, 1.2vw, 10px)' }}
                >
                  <SearchIcon sx={{ fontSize: 'clamp(14px, 2.2vw, 24px)', color: 'rgba(255,255,255,0.7)' }} />
                </InputAdornment>
              ),
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 'clamp(6px, 1.6vw, 12px)',
                bgcolor: 'rgba(255,255,255,0.20)',
                color: 'white',
                minWidth: '120px',
                /* permitir que o tamanho do campo responda ao conteúdo visual (font-size) */
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'rgba(255,255,255,0.12)',
                },

                '&.Mui-focused': {
                  bgcolor: 'rgba(255,255,255,0.20)',
                  boxShadow: '0 0 0 2px var(--ring)',
                  borderColor: 'transparent',
                },

                '& .MuiInputBase-input::placeholder': {
                  color: 'white',
                },
              },

              '& .MuiOutlinedInput-notchedOutline': {
                border: '1px solid rgba(255,255,255,0.12)',
              },

              '& .MuiOutlinedInput-input': {
                /* fonte reduz conforme a largura da viewport para evitar que o campo encolha demais */
                padding: 'clamp(0.45rem, 1.0vw, 0.75rem) clamp(0.6rem, 1.2vw, 1rem)',
                fontSize: 'clamp(0.9rem, 1.6vw, 1rem)',
                lineHeight: 1.1,
              },
            }}
          />
        </Box>

        <IconButton
          aria-label="search"
          size="large"
          onClick={handleSearch}
          sx={{
            borderRadius: 'clamp(6px, 1.2vw, 6px)',
            background: 'dodgerblue',
            minWidth: 'clamp(36px, 7vw, 48px)',
            minHeight: 'clamp(36px, 7vw, 48px)',
            px: 'clamp(6px, 1.2vw, 8px)',
            flexShrink: 0,
            '&:hover': {
              background: '#1f6feb',
            },
          }}
        >
          <SearchIcon sx={{ fontSize: 'clamp(14px, 2.2vw, 18px)', color: 'white' }} />
        </IconButton>
      </Box>
    </Box>
  );
}
