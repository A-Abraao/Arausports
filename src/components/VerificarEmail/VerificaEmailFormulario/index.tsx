import React, { useEffect, useRef, useState } from 'react'
import styled from 'styled-components'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import SetinhaDeVoltar from '../../../assets/img/retornar-setinha.svg?react'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import { Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material'
import { useNavigate, useLocation } from 'react-router-dom'
import { supabase } from '../../../supabase/supabaseClient'
import useResendVerification from '../../../supabase/auth/useResendVerification'
import VerificaEmailActions from './VerificaEmailAction'
import { CodeInput } from './CodeConfirmation'
import useErrorHandler from './useErroHandler'
import useVerificarEmail from '../../../supabase/auth/useVerificarEmail'

// estilização do formulario de confirmar o email
const FormCard = styled.div`
  position: relative;
  width: clamp(20rem, 90%, 40rem);
  background: #fff;
  border-radius: 0.75rem;
  box-shadow: 0 1rem 3rem rgba(0,0,0,0.12), 0 0.25rem 0.75rem rgba(0,0,0,0.06);
  padding: clamp(1rem, 2.5vw, 1.25rem);
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  gap: 1.15em;
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
  gap: clamp(0.25rem, 1vw, 0.6rem);
  margin-bottom: clamp(0.6rem, 1.5vh, 0.9rem);
  padding-top: clamp(0.4rem, 0.8vh, 0.6rem);
`

const Titulo = styled.div`
  font-weight: 510;
  text-align: center;
  margin-top: 0.2rem;
  color: rgba(0,0,0,0.6);
  font-size: 0.9rem;
`

// props do popup de sair da pagina
interface ConfirmLeaveDialogProps {
  open: boolean
  onClose: () => void
  onConfirm: () => void
  title?: string
  message?: string
  confirmLabel?: string
  cancelLabel?: string
}

// componente de sair da pagina (definição única), ele também recebe algumas props, props essas listadas na tipagem acime
function ConfirmLeaveDialog({
  open,
  onClose,
  onConfirm,
  title = 'Confirmação',
  message = 'Tem certeza que deseja voltar? O código inserido será perdido.',
  confirmLabel = 'Voltar',
  cancelLabel = 'Cancelar',
}: ConfirmLeaveDialogProps) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          position: 'relative',
          borderRadius: '0.8em',
          padding: '0.25em',
          overflow: 'hidden',
          width: 'clamp(320px, 80vw, 500px)',
          maxWidth: '100%',
          backgroundColor: 'white',
          boxShadow: '0 6px 30px rgba(0,0,0,0.16)',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '6px',
            background: 'var(--gradient-hero)',
            borderTopLeftRadius: 'inherit',
            borderTopRightRadius: 'inherit',
            zIndex: 2,
          },
        },
      }}
      BackdropProps={{
        sx: {
          backdropFilter: 'blur(6px)',
          backgroundColor: 'rgba(0,0,0,0.28)',
        },
      }}
    >
      <DialogTitle sx={{ fontSize: '1.15rem', mt: 1 }}>{title}</DialogTitle>

      <DialogContent sx={{ mt: 0.5, mb: 0.5, minWidth: 260 }}>
        <Typography sx={{ color: 'rgba(0,0,0,0.75)' }}>{message}</Typography>
      </DialogContent>

      <DialogActions sx={{ px: 2 }}>
        <Button
          onClick={onClose}
          variant="outlined"
          sx={{
            background: 'crimson',
            textTransform: 'none',
            padding: '0.35em 0.7em',
            borderColor: 'var(--sidebar-ring)',
            color: 'white',
            '&:hover': { background: '#b22222' },
          }}
        >
          {cancelLabel}
        </Button>

        <Button
          onClick={onConfirm}
          variant="contained"
          sx={{
            background: 'var(--gradient-hero)',
            padding: '0.35em 0.9em',
            color: 'white',
            textTransform: 'none',
            '&:hover': { opacity: 0.95 },
          }}
        >
          {confirmLabel}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

// componente principal
export function VerificaEmailFormulario() {
  //aqui basicmanete eu defino os hooks, useStates e navigates para o formulario funcionar
  const navigate = useNavigate()
  const location = useLocation()
  const { resend, loading: resendLoading } = useResendVerification()
  const [email, setEmail] = useState('')
  const [digits, setDigits] = useState<string[]>(Array(6).fill(''))
  const [confirmOpen, setConfirmOpen] = useState(false)

  //hook para verificar o email
  const { verify, loading: verifyLoading } = useVerificarEmail();

  const codeInputRef = useRef<any>(null)
  const { userError, userInfo, userSuccess, siteError } = useErrorHandler()

  useEffect(() => {
    const stateEmail = (location.state as any)?.email
    if (stateEmail) setEmail(String(stateEmail).trim().toLowerCase());
  }, [location.state])

  // foco inicial no primeiro campo do CodeInput
  useEffect(() => {
    codeInputRef.current?.focusFirst?.()
  }, [])

  //handle que chama o hook de verificar email
  const handleVerify = async (e?: React.FormEvent) => {
    //evita comportamento nativo de refresh do formulario
    e?.preventDefault();

    if(verifyLoading) return ;

    //junta tudo os baguio que vem separado devido aos inputs serem separados
    //ta veno se tem todos os 6 digitos do token
    const allDigits = digits.join('');
    if (allDigits.length !== 6 || /\D/.test(allDigits)) {
      //se tiver errado os numeros ele manda...
      const msg = allDigits.length === 0
        ? 'Enviamos o código no seu email, deve estar lá....'
        : 'Algo me diz que o código está errado...';
      userError(msg);
      return;
    }

    try {
      const res = await verify(email, allDigits); //aciona o hook de verificar email
      if (res?.session) {
        navigate('/homepage');//manda o cara para a homepage
      } else {
        // se não veio sessão, redireciona para login (ou tenta refresh)
        await supabase.auth.getSession(); // opcional
        navigate('/');
      }
  
    } catch (err: any) {
      // aqui a gente tem dois funcionalidade, o siteError para erro do site mesmo, quando alguma coisa da errada com o site eo userErro que serve para quando o cara faz errado alguma coisa no site
      siteError(err, 'verifyOtp');
      const msg = err?.message ?? 'Falha ao verificar o código.';
      userError(String(msg));
    } finally {
      console.log("deu certo a verficação do email")
    }
  };

  const handleResend = async () => {
    // validação do usuário
    if (!email.trim()) {
      userError('Informe o e-mail para reenviar o código')
      return
    }

    try {
      const ok = await resend(email.trim())
      if (!ok) {
        // erro da API / infraestrutura -> só logamos
        siteError(new Error('resend returned false'), 'resend')
        return
      }
      userInfo('Código reenviado. Verifique sua caixa de entrada.')
    } catch (err: any) {
      siteError(err, 'handleResend (unexpected)')
      return
    }
  }

  //gerneciao o ato de voltar para a pagina anterior aonde o cara tava
  const tryNavigateBack = () => {
    try {
      if (window.history.length > 1) {
        navigate(-1)
      } else {
        navigate('/criar-conta', { replace: true })
      }
    } catch {
      navigate('/criar-conta', { replace: true })
    }
  }

  return (
    <>
      <FormCard>
        <HeaderRow>
          <IconButton onClick={() => setConfirmOpen(true)} sx={{ padding: '0.25rem' }}>
            <SetinhaDeVoltar width="1.5em" height="1.5em"/>
          </IconButton>
          <Typography variant="h6">Verificar e-mail</Typography>
        </HeaderRow>

        <Box component="form" onSubmit={handleVerify} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Titulo>Enviamos um código de 6 dígitos para <strong>{email || 'seu e-mail'}</strong>.</Titulo>

          <CodeInput
            length={6}
            value={digits}
            onChange={(d: string[]) => setDigits(d)}
            ref={codeInputRef}
            ariaLabelPrefix="Dígito"
          />

          <VerificaEmailActions
            email={email}
            loading={verifyLoading}
            resendLoading={resendLoading}
            onResend={handleResend}
            onVerify={handleVerify}
          />

        </Box>
      </FormCard>

      {/* popup confirmando se o usuario quer real voltar para a pagina de criar conta */}
      <ConfirmLeaveDialog
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={() => {
          setConfirmOpen(false)
          tryNavigateBack()
        }}
        title="Quer voltar mesmo?"
        message="Ao voltar a página, o código que você digitou será perdido. Tem certeza que quer sair?"
        confirmLabel="Vou voltar"
        cancelLabel="Deixa pra lá"
      />
    </>
  )
}
