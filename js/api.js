// objeto javascript que está armazenando funções
const api = {
    async buscarPensamentos(){
        try {
            // faz o fetch (requisição) ao servidor que criamos, retorna uma promise
            // automaticamente um fetch já é um método GET, por isso não precisa colocar
            const response = await fetch('http://localhost:3000/pensamentos');
            // a resposta desta requisição armazenamos em uma variável para transformá-la em um objeto javascript
            // antes: json ->  depois: javascript
            return await response.json();
        } catch (error) {
            console.error('Erro ao renderizar pensamentos:', error);
            alert('Erro ao renderizar pensamento');
        }
    },

    async salvarPensamento(pensamento){
        try {
            const response = await fetch('http://localhost:3000/pensamentos', {
                method: "POST",
                // o "assunto" do método, que no caso é do tipo json
                headers: {
                    "Content-Type": "application/json"
                },
                // como é enviado em formato JSON, precisamos converter para objeto javascript
                body: JSON.stringify(pensamento)
            });
            return await response.json();
        } catch (error) {
            console.error('Erro ao renderizar pensamentos:', error);
            alert('Erro ao renderizar pensamento');
        }
    }
}

// exportação da variável api para ser usada em outros arquivos .js
export default api;