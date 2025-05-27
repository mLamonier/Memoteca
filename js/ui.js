import api from './api.js';

// objeto javascript que está armazenando funções
const ui = {

    async preencherFormulario(pensamentoId){
        const pensamento = await api.buscarPensamentoPorId(pensamentoId);
        document.getElementById('pensamento-id').value = pensamento.id;
        document.getElementById('pensamento-conteudo').value = pensamento.conteudo;
        document.getElementById('pensamento-autoria').value = pensamento.autoria;
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

        const iconeFavorito = document.createElement('img');
        iconeFavorito.src = 'assets/imagens/icone-favorito_outline.png';
        iconeFavorito.alt = 'Ícone de favorito';
        botaoFavorito.append(iconeFavorito);

        const icones = document.createElement('div');
        icones.classList.add('icones');
        icones.append(botaoFavorito, botaoEditar, botaoExcluir);

        li.append(iconeAspas, pensamentoConteudo, pensamentoAutoria, icones);

        listaPensamentos.append(li);
    }
}

export default ui;