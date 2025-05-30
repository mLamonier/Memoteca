import ui from "./ui.js";
import api from "./api.js";

//Expressões Regulares: (REGEX)
// // (barras) = delimita a expressão, inicio e fim
// ^ (acento circunflexo) = indica o início da expressão
// $ (cifrão) = indica o fim da expressão
// [] (colchetes) = entre colchetes será o que deverá conter esta expressão
// A-Z (caracteres de letras maiúsculas)
// a-z (caracteres de letras minúsculas)
// À-ÿ (caracteres com acentos)
// \s (permissão para inserir espaços, tabulações, quebras de linhas)
// {} (chaves) = fora dos colchetes, define as regras das caracteres permitidas
    //no caso usado abaixo, o 10 significa o número de caracteres mínimos permitidos e após a vírgula seria o máximo
    //como está vazio, significa que não tem um limite de caracteres, é infinito
const regexConteudo = /^[A-Za-zÀ-ÿ\s]{10,}$/;

const regexAutoria = /^[A-Za-zÀ-ÿ]{3,15}$/;

//função para encontrar caracteres com espaços
// método replaceAll = usado junto com uma expressão regular para encontrar caracteres específicos e substituir por outro caractere ou espaço vazio
// + (sinal de adição) = usado para encontrar 1 ou mais espaços dentro daquela string
// g (global) = ocorre em TODAS as ocorrências que houverem e não somente na primeira, se não colocar, ele faz somente 1 substituição
function removerEspacos(string) {
    return string.replaceAll(/\s+/g, '');
}

function validarConteudo(conteudo){
    //método test retorna um valor booleano, neste caso, true se seguiu os requisitos da Regex ou não
    return regexConteudo.test(conteudo);
}

function validarAutoria(autoria){
    return regexAutoria.test(autoria);
}

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
        document.getElementById('pensamento-data').value = '';
    })

    const inputBusca = document.getElementById('campo-busca');
    //evento 'input' é chamado toda vez que houver uma modificação do campo (digitação)
    inputBusca.addEventListener('input', manipularBusca);
})

async function manipularSubmissaoFormulario(event) {
    event.preventDefault();
    const id = document.getElementById('pensamento-id').value;
    const conteudo = document.getElementById('pensamento-conteudo').value;
    const autoria = document.getElementById('pensamento-autoria').value;
    const data = document.getElementById('pensamento-data').value;

    const conteudoSemEspacos = removerEspacos(conteudo);
    const autoriaSemEspacos = removerEspacos(autoria);

    if(!validarAutoria(autoriaSemEspacos)){
        alert('AUTORIA: É permitida a inclusão de letras e entre 3 e 15 caracteres sem espaços.');
        return;
    }

    if(!validarConteudo(conteudoSemEspacos)){
        alert('PENSAMENTO: É permitida a inclusão apenas de letras e espaços com no mínimo 10 caracteres.');
        return;
    }

    //este if seria a mesma coisa que: validarData() === false;
    //ou seja, se a data atual NÃO for menor que a data inserida, ela é inválida, pois não é permitido datas futuras 
    if(!validarData(data)){
        alert('Não é permitido o cadastro de datas futuras. Selecione outra data.');
        return;
    }

    try{
        if(id) { //se exister um id, faça isso:
            //aqui já precisa informar o id, pois se estamos editando, significa que json-server já criou ele
            await api.editarPensamento({id, conteudo, autoria, data})
        } else {
            //aqui não precisamos chamar o id, pois o json-server já cria um novo id automaticamente
            await api.salvarPensamento({conteudo, autoria, data});
        }
        ui.renderizarPensamentos();
    }catch (error){
        alert('Erro ao salvar pensamento');
    }
}

async function manipularBusca() {
    const termoBusca = document.getElementById('campo-busca').value;
    try {
        const pensamentosFiltrados = await api.buscarPensamentosPorTermo(termoBusca);
        ui.renderizarPensamentos(pensamentosFiltrados);
    } catch (error) {
        alert('Erro ao realizar busca');
    }
}

function validarData(data){
    const dataAtual = new Date();
    const dataInserida = new Date(data);
    return dataInserida <= dataAtual;
}