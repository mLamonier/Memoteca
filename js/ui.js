import api from './api.js';

// objeto javascript que está armazenando funções
const ui = {

    async preencherFormulario(pensamentoId){
        const pensamento = await api.buscarPensamentoPorId(pensamentoId);
        document.getElementById('pensamento-id').value = pensamento.id;
        document.getElementById('pensamento-conteudo').value = pensamento.conteudo;
        document.getElementById('pensamento-autoria').value = pensamento.autoria;
        //formato da data no db.json: "2024-05-25T19:20:40.888Z"
        //usamos a função toISOString para transformar uma objeto date em string padrão UTC e conseguirmos separála pelo "T"
        //depois pegando o primeiro elemento do array criado pela split que será "2024-05-25"
        document.getElementById('pensamento-data').value = pensamento.data.toISOString().split('T')[0];
        //quando clicar no botão editar de algum pensamento, será 'scrollado' automaticamente para a área formulário
        document.getElementById('form-container').scrollIntoView(); 
    },

    //o parâmetro desta função deve ser null pois o usuário deve poder ler o conteúdo sem a necessidade de pesquisa dinâmica
    async renderizarPensamentos(pensamentosFiltrados = null) {
        //estas duas linhas de código a seguir são necessárias para "limpar" a lista
        //para quando houver exclusão de algum pensamento, não haver erros na renderização dos novos pensamentos
        //fazendo assim sempre renderizar uma lista "limpa" e nova
        const listaPensamentos = document.getElementById('lista-pensamentos');
        listaPensamentos.innerHTML = '';

        try {
            //quando criamos variável assim, ela será undefined e não null
            let pensamentosParaRenderizar

            //se existir algum pensamento filtrado faça a busca do que está digitado
            if(pensamentosFiltrados){
                pensamentosParaRenderizar = pensamentosFiltrados;
            //se não existe pensamentos filtrados, faça a busca de todos os pensamentos
            } else {
                pensamentosParaRenderizar = await api.buscarPensamentos();
            }

            pensamentosParaRenderizar.forEach(ui.adicionarPensamentoNaLista);

            //verificação para exibir a mensagem quando a lista estiver vazia
            const listaVazia = document.querySelector('.lista-vazia');
            if(pensamentosParaRenderizar.length != 0){
                listaVazia.classList.add('desativada');
            } else{
                listaVazia.classList.remove('desativada');
                pensamentosParaRenderizar.forEach(ui.adicionarPensamentoNaLista);
            }
        } catch (error) {
            console.error('Erro ao renderizar pensamentos:', error);
            alert('Erro ao renderizar pensamentos');
        }
    },

    adicionarPensamentoNaLista(pensamento){
        const listaPensamentos = document.getElementById('lista-pensamentos');
        const li = document.createElement('li');
        li.setAttribute('data-id', pensamento.id);
        li.classList.add('li-pensamento');

        const iconeAspas = document.createElement('img');
        iconeAspas.src = 'assets/imagens/aspas-azuis.png';
        iconeAspas.alt = 'Aspas azuis';
        iconeAspas.classList.add('icone-aspas');

        const pensamentoConteudo = document.createElement('div');
        pensamentoConteudo.textContent = pensamento.conteudo;
        pensamentoConteudo.classList.add('pensamento-conteudo');

        const pensamentoAutoria = document.createElement('div');
        pensamentoAutoria.textContent = pensamento.autoria;
        pensamentoAutoria.classList.add('pensamento-autoria');

        const pensamentoData = document.createElement('div');

        var options = {
            weekday: 'long', //dia da semana por extenso
            year: 'numeric', //ano por número
            month: 'long', //mês por extenso
            day: 'numeric', //dia por número
            timeZone: 'UTC' //região é UTC, para não haver problemas com fusos horários
        };
        const dataFormatada = pensamento.data.toLocaleDateString('pt-BR', options);
        // () (parenteses) = significa que iremos guardar o valor dentro dele em uma variável
        // \w = indica o primeiro caractere da string
        // match = nome dado para representar o resultado da busca da regex, que será a primeira letra
        // se usa uma arrow function para não ter que escrever muito com uma function normal, colocar return etc
        // o método replace exige uma string e uma função como parâmetros, nesta ordem, caso não, ele retorna um erro
        const dataComRegex = dataFormatada.replace(/^(\w)/, (match) => match.toUpperCase()); 
        pensamentoData.textContent = dataComRegex;
        pensamentoData.classList.add('pensamento-data');

        const botaoEditar = document.createElement('button');
        botaoEditar.classList.add('botao-editar');
        //atribui um evento de click onde será passada a função preencherFormulario criada acima
        //é necessário colocar o "ui." antes, porque a função é uma propriedade do objeto 'ui'
        botaoEditar.onclick = () => ui.preencherFormulario(pensamento.id);

        const iconeEditar = document.createElement('img');
        iconeEditar.src = 'assets/imagens/icone-editar.png';
        iconeEditar.alt = 'Editar';
        botaoEditar.append(iconeEditar);

        const botaoExcluir = document.createElement('button');
        botaoExcluir.classList.add('botao-excluir');
        botaoExcluir.onclick = async () => {
            try {
                await api.excluirPensamento(pensamento.id);
                ui.renderizarPensamentos();
            } catch (error) {
                alert('Erro ao excluir pensamento');
            }
        }

        const iconeExcluir = document.createElement('img');
        iconeExcluir.src = 'assets/imagens/icone-excluir.png';
        iconeExcluir.alt = 'Excluir';
        botaoExcluir.append(iconeExcluir);

        const botaoFavorito = document.createElement('button');
        botaoFavorito.classList.add('botao-favorito');
        botaoFavorito.onclick = async () => {
            try {
                //para que a propriedade favorito seja alterada, é necessário colocar um sinal de negação antes (!)
                //pois como estamos selecionando o pensamento em si, se não colocarmos negação, ele não altera
                //apenas fica atualizando para o status atual da propriedade favorito
                //como passamos uma negação, sempre será o oposto do que já está no pensamento
                await api.atualizarFavorito(pensamento.id, !pensamento.favorito);
                ui.renderizarPensamentos();
            } catch (error) {
                alert('Erro ao atualizar pensamento');
            }
        }

        const iconeFavorito = document.createElement('img');
        iconeFavorito.src = 
            pensamento.favorito ? //operador ternário, se pensamento.favorito for true, faça, se não...
                'assets/imagens/icone-favorito.png' :                
                'assets/imagens/icone-favorito_outline.png';

        iconeFavorito.alt = 'Ícone de favorito';
        botaoFavorito.append(iconeFavorito);

        const icones = document.createElement('div');
        icones.classList.add('icones');
        icones.append(botaoFavorito, botaoEditar, botaoExcluir);

        li.append(iconeAspas, pensamentoConteudo, pensamentoAutoria, icones, pensamentoData);

        listaPensamentos.append(li);
    }
}

export default ui;