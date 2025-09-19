import Box from '@mui/material/Box';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import { useState } from 'react';
import type { SelectChangeEvent } from '@mui/material/Select';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';

type BasicSelectProps = {
  placeholder?: string;
  listaDeOpcoes?: string[];
};

export default function FiltroOpcao({ placeholder, listaDeOpcoes = [] }: BasicSelectProps) {
  const [option, setOption] = useState('');

  const handleChange = (event: SelectChangeEvent) => {
    setOption(event.target.value);
  };

  return (
    <Box sx={{ minWidth: 200 }}>
      <FormControl fullWidth size="small" variant="outlined">
        <InputLabel>{placeholder}</InputLabel>

        <Select
            value={option}
            onChange={handleChange}
            IconComponent={ArrowDropDownIcon}
            sx={{
              fontSize: '0.85rem',
              height: 44, //altura
              '.MuiSelect-select': {
                paddingTop: '4px',
                paddingBottom: '4px',
              },
              borderRadius: 2,
              '& .MuiOutlinedInput-notchedOutline': {
                border: 'none',
              },
              '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                border: '2px solid var(--ring) !important',
              },
              '&:hover .MuiOutlinedInput-notchedOutline': {
                border: 'none',
              },
            }}
            MenuProps={{
              PaperProps: {
                sx: {
                  fontSize: '0.85rem',
                  borderRadius: 1.5,
                },
              },
              MenuListProps: { dense: true },
            }}
          >

          {listaDeOpcoes.map((item, index) => (
            <MenuItem
              key={index}
              value={item}
              sx={{ fontSize: '0.85rem', py: 0.5 }}
            >
              {item}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
}
