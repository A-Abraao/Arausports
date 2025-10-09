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
        maxWidth: 'clamp(170px, 40vw, 490px)',
        mx: 'auto',
        p: 'clamp(0.45rem, 1.6vw, 1rem)', 
        borderRadius: 'clamp(6px, 1.6vw, 12px)',
        border: '1px solid rgba(255,255,255,0.2)',
        bgcolor: 'rgba(255,255,255,0.06)',
        backdropFilter: 'blur(6px)',
      }}
    >
      <Box sx={{ display: 'flex', gap: 'clamp(0.5rem, 1.6vw, 1rem)' }}>
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
                <InputAdornment
                  position="start"
                  sx={{ mr: 'clamp(6px, 1.5vw, 10px)' }}
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
                padding: 'clamp(0.45rem, 1.2vw, 0.75rem) clamp(0.6rem, 1.8vw, 1rem)',
                fontSize: 'clamp(0.9rem, 1.6vw, 1rem)',
              },
            }}
          />
        </Box>

        <IconButton
          aria-label="search"
          size="large"
          onClick={handleSearch}
          sx={{
            borderRadius: 'clamp(4px, 0.8vw, 6px)',
            background: 'dodgerblue',
            minWidth: 'clamp(36px, 6.5vw, 44px)',
            minHeight: 'clamp(36px, 6.5vw, 44px)',
            px: 'clamp(6px, 1.8vw, 8px)',
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
