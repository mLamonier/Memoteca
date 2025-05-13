import ui from "./ui.js";

// DOMContentLoaded = executa quando o HTML termina de ser carregado
document.addEventListener('DOMContentLoaded', () => {
    //exibe os pensamentos que estão presentes no db.json no HTML
    ui.renderizarPensamentos();
})