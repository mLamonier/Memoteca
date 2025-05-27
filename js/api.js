const URL_BASE = 'http://localhost:3000';

// objeto javascript que está armazenando funções
const api = {
    async buscarPensamentos(){
        try {
            // faz o fetch (requisição) ao servidor que criamos, retorna uma promise
            // automaticamente um fetch já é um método GET, por isso não precisa colocar
            // método GET = busca/requisita
            // se fosse usar o axios seria assim o código:
            // const response = await axios.get(`${URL_BASE}/pensamentos`);
            const response = await fetch(`${URL_BASE}/pensamentos`);
            // a resposta desta requisição armazenamos em uma variável para transformá-la em um objeto javascript
            // antes: json ->  depois: javascript
            // se fosse usar o axios seria assim o código:
            // return await response.data;
            return await response.json();
        } catch (error) {
            console.error('Erro ao renderizar pensamentos:', error);
            alert('Erro ao renderizar pensamento');
        }
    },

    async salvarPensamento(pensamento){
        try {
            // se fosse usar o axios seria apenas assim o código:
            // const response = await axios.post(`${URL_BASE}/pensamentos`, pensamento);
            // return await response.data;
            const response = await fetch(`${URL_BASE}/pensamentos`, {
                //método POST = insere/cria
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
            console.error('Erro ao salvar pensamento:', error);
            alert('Erro ao salvar pensamento');
        }
    },

    async buscarPensamentoPorId(id){
        try {
            const response = await fetch(`${URL_BASE}/pensamentos/${id}`);
            return await response.json();
        } catch (error) {
            console.error('Erro ao buscar pensamento:', error);
            alert('Erro ao buscar pensamento');
        }
    },

    async editarPensamento(pensamento){
        try {
            // se fosse usar o axios seria apenas assim o código:
            // const response = await axios.put(`${URL_BASE}/pensamentos`, pensamento);
            // return await response.data;
            //como queremos editar somente 1 pensamento, devemos passar desta forma:
            const response = await fetch(`${URL_BASE}/pensamentos/${pensamento.id}`, {
                //método PUT = edita
                //o método put precisa do pensamento por completo, diferente do método patch
                //pois ele edita todas as propriedades de uma vez ou cria se não existir
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(pensamento)
            });
            return await response.json();
        } catch (error) {
            console.error('Erro ao editar pensamento:', error);
            alert('Erro ao editar pensamento');
        }
    },

    async excluirPensamento(id){
        try {
            // se fosse usar o axios seria apenas assim o código:
            // const response = await axios.delete(`${URL_BASE}/pensamentos`, pensamento);
            // return await response.data;
            const response = await fetch(`${URL_BASE}/pensamentos/${id}`, {
                method: "DELETE"
            });
        } catch (error) {
            console.error('Erro ao excluir pensamento:', error);
            alert('Erro ao excluir pensamento');
        }
    },

    //função de pesquisa
    async buscarPensamentosPorTermo(termo) {
        try {
            //aqui o 'this' seria a mesma coisa que = 'api.buscarPensamentos()'
            //como estamos dentro do proprio objeto, podemos usar o this
            const pensamentos = await this.buscarPensamentos();
            const termoEmMinusculas = termo.toLowerCase();
    
            //percorre cada pensamento e aplica um filtro
            //este filtro compra o conteúdo digita pelo usuário (termo) pelo pensamento que está sendo percorrido
            //podendo ser o conteudo ou autoria
            const pensamentosFiltrados = pensamentos.filter(pensamento => {
                return (pensamento.conteudo.toLowerCase().includes(termoEmMinusculas) ||
                pensamento.autoria.toLowerCase().includes(termoEmMinusculas));
            });
            return pensamentosFiltrados;            
        } catch (error) {
            alert('Erro ao filtrar pensamentos');
            throw error;
        }
    },

    async atualizarFavorito(id, favorito){
        try {
            //o método PATCH faz a edição igual ao PUT, porém só edita 1 propriedade por vez, edição parcial
            const response = await axios.patch(`${URL_BASE}/pensamentos/${id}`, {favorito});
            return response.data;
        } catch (error) {
            alert("Erro ao atualizar favorito");
            throw error
        }
    }
}

// exportação da variável api para ser usada em outros arquivos .js
export default api;