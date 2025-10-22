import styled from 'styled-components'
import Button from '@mui/material/Button'
import SendIcon from '../../../../assets/img/icone-enviar.svg?react';

//estilização da parada
const ActionsRow = styled.div`
  display: flex;
  gap: clamp(0.5rem, 1.2vw, 0.75rem);
  justify-content: flex-end;
  margin-top: clamp(0.6rem, 1.5vh, 0.75rem);
  flex-wrap: wrap;
`
//props que vai receber
interface VerificaEmailActionsProps {
  email: string
  loading: boolean
  resendLoading: boolean
  onResend: () => Promise<void>
  onVerify: (e?: React.FormEvent) => Promise<void>
}

//função com as props, ou argumentos no react
export default function VerificaEmailActions({
  email,
  loading,
  resendLoading,
  onResend,
  onVerify,
}: VerificaEmailActionsProps) {
  return (
    <ActionsRow>
      <Button
        type="button"
        variant="outlined"
        onClick={onResend}
        disabled={resendLoading}
        sx={{
            display: "flex",
            alignItems: 'center',
            gap: "0.25em",
            textTransform: 'none',
            minWidth: '1em',
            color: 'white',
            padding: "",
            background: 'var(--azul-gradient)',
            '&:hover': { filter: 'brightness(0.95)' },
        }}
      >
        <SendIcon height="1.75em" width="1.75em"/>
        Reenviar
      </Button>

      <Button
        type="submit"
        variant="contained"
        disabled={loading}
        onClick={(e) => onVerify(e)}
        sx={{
          textTransform: 'none',
          minWidth: '1em',
          background: 'var(--gradient-hero)',
          '&:hover': { filter: 'brightness(0.95)' },
        }}
      >
        {loading ? 'Verificando...' : 'Verificar'}
      </Button>
    </ActionsRow>
  )
}
