export function verificaEmail(email:string) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    let emailValido = regex.test(email)
    try {
        if (!emailValido) {
            console.log("vish viado, email ta errado")
            return false
        }
    } catch (error) {
        console.log("puuuuutz :( \n" + error)
    }
    
}