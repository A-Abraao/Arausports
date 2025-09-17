
export function verificaEmail(email: string): boolean {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    //testa o email e retorna false se ele de errado
    const emailValido = regex.test(email.trim());

    //verifica se o email ta tudo certo man
    if (!emailValido) console.log("Email inválido:", email);

    return emailValido;
}
