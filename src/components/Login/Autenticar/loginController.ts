//função que verifica que o usuário fez o login o certo
export async function validarLogin(email:string, senha:string) {

    //função que verifica se o email esta certo
    const handleValidarEmail = (valor: string) => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(valor)
    }
    try {
        //condicional para ver se email
        if (email) {
            //condicional que ve se o email ta escrito certo lá karai
            if (handleValidarEmail(email)) {
                return true
            } else {
                alert("tu ta ligado que o email ta errado né?")
                return false
            }
        } else {
            alert("vish viado, ta sem email")
            return false
        }
    

    } catch (error) {
        console.error("patrão a gente não teve oportunidade boa aqui :( \n" + error)
    }

}
