import { useEffect, useState } from 'react'
import styled from 'styled-components'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import Alert from '@mui/material/Alert'
import IconButton from '@mui/material/IconButton'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAlert } from '../../Alerta/AlertProvider'
import { supabase } from '../../../supabase/supabaseClient'
import useResendVerification from '../../../supabase/auth/useResendVerification'

const FormCard = styled.div`
  position: relative;
  width: clamp(20rem, 90%, 40rem);
  background: #fff;
  border-radius: 0.75rem;
  box-shadow: 0 1rem 3rem rgba(0,0,0,0.12), 0 0.25rem 0.75rem rgba(0,0,0,0.06);
  padding: clamp(1rem, 2.5vw, 1.25rem);
  box-sizing: border-box;
  overflow: hidden;
  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: clamp(0.2rem, 0.35vh, 0.35rem);
    background: var(--gradient-hero);
    border-top-left-radius: inherit;
    border-top-right-radius: inherit;
    z-index: 2;
  }
`

const HeaderRow = styled.div`
  display: flex;
  align-items: center;
  gap: clamp(0.5rem, 1.2vw, 0.8rem);
  margin-bottom: clamp(0.6rem, 1.5vh, 0.9rem);
  padding-top: clamp(0.4rem, 0.8vh, 0.6rem);
`

const ActionsRow = styled.div`
  display: flex;
  gap: clamp(0.5rem, 1.2vw, 0.75rem);
  justify-content: center;
  margin-top: clamp(0.6rem, 1.5vh, 0.75rem);
  flex-wrap: wrap;
`

export function VerificaEmailFormulario() {
  const navigate = useNavigate()
  const location = useLocation()
  const { showAlert } = useAlert()
  const { resend, loading: resendLoading } = useResendVerification()
  const [email, setEmail] = useState('')
  const [token, setToken] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'error' | 'success'; text: string } | null>(null)

  useEffect(() => {
    const stateEmail = (location.state as any)?.email
    if (stateEmail) setEmail(stateEmail)
  }, [location.state])

  const validateInputs = () => {
    if (!email.trim()) {
      setMessage({ type: 'error', text: 'Informe um e-mail válido' })
      return false
    }
    const tokenOnlyDigits = /^\d{6}$/.test(token)
    if (!tokenOnlyDigits) {
      setMessage({ type: 'error', text: 'Informe o código de 6 dígitos' })
      return false
    }
    return true
  }

  const handleVerify = async (e?: React.FormEvent) => {
    e?.preventDefault()
    setMessage(null)
    if (!validateInputs()) return
    setLoading(true)
    try {
      const { data, error } = await supabase.auth.verifyOtp({ email: email.trim(), token: token.trim(), type: 'email' })
      if (error) {
        setMessage({ type: 'error', text: error.message || 'Erro ao verificar o token' })
        return
      }
      const sessionRes = await supabase.auth.getSession()
      if (sessionRes?.data?.session) {
        showAlert('E-mail verificado com sucesso! Entrando...', { severity: 'success', duration: 3000 })
        navigate('/homepage')
        return
      }
      setMessage({ type: 'success', text: 'E-mail verificado com sucesso! Faça login para continuar.' })
      showAlert('E-mail verificado. Faça login para continuar.', { severity: 'success', duration: 4000 })
      navigate('/')
    } catch (err: any) {
      setMessage({ type: 'error', text: err?.message ?? 'Erro inesperado' })
    } finally {
      setLoading(false)
    }
  }

  const handleResend = async () => {
    setMessage(null)
    if (!email.trim()) {
      setMessage({ type: 'error', text: 'Informe o e-mail para reenviar o código' })
      return
    }
    const ok = await resend(email.trim())
    if (!ok) {
      setMessage({ type: 'error', text: 'Erro ao reenviar o código' })
      return
    }
    setMessage({ type: 'success', text: 'Código reenviado. Verifique sua caixa de entrada.' })
    showAlert('Código reenviado', { severity: 'info', duration: 3000 })
  }

  return (
    <FormCard>
      <HeaderRow>
        <IconButton onClick={() => navigate(-1)} sx={{ padding: '0.25rem' }}>
          <ArrowBackIcon fontSize="small" />
        </IconButton>
        <Typography variant="h6">Verificar e-mail</Typography>
      </HeaderRow>

      <Box component="form" onSubmit={handleVerify} sx={{ display: 'flex', flexDirection: 'column', gap: clampCss('0.75rem', '1.6vw', '1rem') }}>
        <TextField label="E-mail" value={email} onChange={(e) => setEmail(e.target.value)} required fullWidth InputLabelProps={{ shrink: true }} sx={{ '& .MuiOutlinedInput-root': { borderRadius: '0.35rem', minHeight: '3rem' } }} />
        <TextField label="Código (6 dígitos)" value={token} onChange={(e) => setToken(e.target.value)} required inputProps={{ maxLength: 6 }} fullWidth sx={{ '& .MuiOutlinedInput-root': { borderRadius: '0.35rem', minHeight: '3rem' } }} />

        {message && (
          <Alert severity={message.type === 'error' ? 'error' : 'success'}>{message.text}</Alert>
        )}

        <ActionsRow>
          <Button type="submit" variant="contained" disabled={loading} sx={{ textTransform: 'none', minWidth: 'clamp(8rem, 35%, 12rem)' }}>
            {loading ? 'Verificando...' : 'Verificar código'}
          </Button>

          <Button type="button" variant="outlined" disabled={resendLoading} onClick={handleResend} sx={{ textTransform: 'none', minWidth: 'clamp(8rem, 35%, 12rem)' }}>
            Reenviar código
          </Button>
        </ActionsRow>
      </Box>
    </FormCard>
  )
}

function clampCss(a: string, b: string, c: string) {
  return `clamp(${a}, ${b}, ${c})`
}