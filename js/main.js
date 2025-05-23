import ui from "./ui.js";
import api from "./api.js";

// DOMContentLoaded = executa quando o HTML termina de ser carregado
document.addEventListener('DOMContentLoaded', () => {
    //exibe os pensamentos que estão presentes no db.json no HTML
    ui.renderizarPensamentos();

    const formularioPensamento = document.getElementById('pensamento-form');
    //insere um evento de submissão de formulário onde quando executado,
    //salva o novo pensamento no arquivo db.json, isso é uma requisição POST
    formularioPensamento.addEventListener('submit', manipularSubmissaoFormulario);

    const botaoCancelarNovoPensamento = document.getElementById('botao-cancelar');
    botaoCancelarNovoPensamento.addEventListener('click', () => {
        document.getElementById('pensamento-conteudo').value = '';
        document.getElementById('pensamento-autoria').value = '';
    })
})

async function manipularSubmissaoFormulario(event) {
    event.preventDefault();
    const id = document.getElementById('pensamento-id').value;
    const conteudo = document.getElementById('pensamento-conteudo').value;
    const autoria = document.getElementById('pensamento-autoria').value;

    try{
        await api.salvarPensamento({conteudo, autoria});
        ui.renderizarPensamentos();
    }catch (error){
        alert('Erro ao salvar pensamento');
    }
}