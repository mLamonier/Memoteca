const URL_BASE = 'http://localhost:3000';

const converterStringParaData = (dataString) => {
    //formato utc: 2024-08-12
    //split = quebra as strings transformando em arrays
    //isso se chama desestruturação
    const [ano, mes, dia] = dataString.split('-');
    //aqui se cria uma nova data do tipo UTC que recebe os valores que estavam em string (ano, mês, dia)
    //deve-se colocar o -1 no mês pois o formato date é de 0 a 11 e não de 1 a 12
    return new Date(Date.UTC(ano, mes - 1, dia));
}

// objeto javascript que está armazenando funções
const api = {
    async buscarPensamentos(){
        try {
            const response = await axios.get(`${URL_BASE}/pensamentos`);
            const pensamentos = response.data;

            //map = percorre cada pensamento, para cada um, se cria um novo objeto
            //usa o operador de espalhamento para copiar todas as propriedades do pensamento original
            //sobrescreve a propriedade data, convertendo o valor original (string) para um objeto Date do JS
            return pensamentos.map(pensamento => {
                return  {
                    ...pensamento,
                    data: new Date(pensamento.data)
                }
            });

            // se caso não for usar a biblioteca axios:
            // faz o fetch (requisição) ao servidor que criamos, retorna uma promise
            // automaticamente um fetch já é um método GET, por isso não precisa colocar
            // método GET = busca/requisita
            // const response = await fetch(`${URL_BASE}/pensamentos`);
            // a resposta desta requisição armazenamos em uma variável para transformá-la em um objeto javascript
            // antes: json ->  depois: javascript
            // return await response.json();

        } catch (error) {
            console.error('Erro ao renderizar pensamentos:', error);
            alert('Erro ao renderizar pensamento');
        }
    },

    async salvarPensamento(pensamento){
        try {
            const data = converterStringParaData(pensamento.data);
            const response = await axios.post(`${URL_BASE}/pensamentos`, {
                //... = operador de espalhamento
                //ele "seleciona" todos os dados que já existem naquele pensamento e mantém
                //só modificará a data neste caso
                //deixa o código menos verboso
                ...pensamento,
                //transforma a data inserida pelo usuário em string
                data: data.toISOString()
            });
            return await response.data;

            // se caso não for usar a biblioteca axios:
            // const response = await fetch(`${URL_BASE}/pensamentos`, {
            //     //método POST = insere/cria
            //     method: "POST",
            //     // o "assunto" do método, que no caso é do tipo json
            //     headers: {
            //         "Content-Type": "application/json"
            //     },
            //     // como é enviado em formato JSON, precisamos converter para objeto javascript
            //     body: JSON.stringify({
            //         ...pensamento,
            //         data
            //     })
            // });
            // return await response.json();
            
        } catch (error) {
            console.error('Erro ao salvar pensamento:', error);
            alert('Erro ao salvar pensamento');
        }
    },

    async buscarPensamentoPorId(id){
        try {
            const response = await axios.get(`${URL_BASE}/pensamentos/${id}`);
            const pensamento = await response.data;

            return {
                ...pensamento,
                data: new Date(pensamento.data)
            }

            //se fosse usar o fetch, seria assim:
            // const response = await fetch(`${URL_BASE}/pensamentos/${id}`);
            // return await response.json();

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