const api = {
    async buscarPensamentos(){
        try {
            // faz o fetch (requisição) ao servidor que criamos, retorna uma promise
            const response = await fetch('http://localhost:3000/pensamentos');
            // a resposta desta requisição armazenamos em uma variável para transformá-la em um objeto javascript
            // antes: json ->  depois: javascript
            return await response.json();
        } catch (error) {
            console.error('Erro ao renderizar pensamentos:', error);
            alert('Erro ao renderizar pensamento');
        }
    }
}

// exportação da variável api para ser usada em outros arquivos .js
export default api;