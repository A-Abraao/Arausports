export function verificaSenha(senha: string) {
    if(senha.trim().length > 0 == false) {
        console.log("senha está vazia eu acho")
        return false
    } else {
        return true
    }
}