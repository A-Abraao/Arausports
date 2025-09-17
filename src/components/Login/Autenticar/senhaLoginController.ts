export function verificaSenha(senha: string): boolean {
    //retorna false se for vazia
    const ok = senha.trim().length > 0;

    //verifica ela viado
    if (!ok) console.log("Senha inválida (vazia)");

    return ok;
}
