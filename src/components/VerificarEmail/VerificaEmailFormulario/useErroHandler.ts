import { useCallback } from 'react'
import { useAlert } from '../../Alerta/AlertProvider'

//essa aqui é lista ou opções de mensagem pro usuario quando der alguma parada sinistra no site
export type UserAlertOptions = {
  severity?: 'error' | 'info' | 'success' | 'warning'
  duration?: number
  center?: boolean
  variant?: 'filled' | 'standard' | 'outlined'
}

//esse hoook tem a função de centralizar a tratamento de erros no site
export default function useErrorHandler() {
  const { showAlert } = useAlert()

  const userError = useCallback((message: string, opts: UserAlertOptions = {}) => {
    const { duration = 4500, severity = 'error', center = true, variant = 'filled' } = opts
    showAlert(message, { severity, duration, center, variant })
  }, [showAlert])

  const userInfo = useCallback((message: string, opts: Partial<UserAlertOptions> = {}) => {
    const { duration = 3000, severity = 'info', center = true, variant = 'standard' } = opts
    showAlert(message, { severity, duration, center, variant })
  }, [showAlert])

  const userSuccess = useCallback((message: string, opts: Partial<UserAlertOptions> = {}) => {
    const { duration = 3000, severity = 'success', center = true, variant = 'filled' } = opts
    showAlert(message, { severity, duration, center, variant })
  }, [showAlert])

  const siteError = useCallback((err: unknown, context?: string) => {
    //esses erros aqui serão mostrados no console para não dificultar a experiencia do site
    if (context) {
      console.error(`[SiteError] ${context}:`, err)
    } else {
      console.error('[SiteError]:', err)
    }
  }, [])

  return {
    userError,
    userInfo,
    userSuccess,
    siteError,
  }
}
