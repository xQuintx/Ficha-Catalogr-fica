class FichaBuilder {
    constructor() {
        this.reset();
    }

    reset() {
        this.ficha = {
            titulo: '',
            subtitulo: '',
            orientador: { nome: '', titulacao: '' },
            coorientador: null,
            ano: '',
            folhas: '',
            ilustracao: '',
            unidade: '',
            tipoTrabalho: '',
            palavrasChave: [],
            fonte: ''
        };
    }

    setTitulo(titulo) {
        this.ficha.titulo = titulo;
        return this;
    }

    setSubtitulo(subtitulo) {
        this.ficha.subtitulo = subtitulo;
        return this;
    }

    setOrientador(nome, titulacao) {
        this.ficha.orientador = { nome, titulacao };
        return this;
    }

    setCoorientador(nome, titulacao) {
        if (nome && titulacao) {
            this.ficha.coorientador = { nome, titulacao };
        }
        return this;
    }

    setAno(ano) {
        this.ficha.ano = ano;
        return this;
    }

    setFolhas(folhas) {
        this.ficha.folhas = folhas;
        return this;
    }

    setIlustracao(ilustracao) {
        this.ficha.ilustracao = ilustracao;
        return this;
    }

    setUnidade(unidade) {
        this.ficha.unidade = unidade;
        return this;
    }

    setTipoTrabalho(tipo) {
        this.ficha.tipoTrabalho = tipo;
        return this;
    }

    addPalavraChave(palavra) {
        if (palavra) {
            this.ficha.palavrasChave.push(palavra);
        }
        return this;
    }

    setFonte(fonte) {
        this.ficha.fonte = fonte;
        return this;
    }

    build() {
        // Validações
        if (!this.ficha.titulo || !this.ficha.orientador.nome || !this.ficha.ano || !this.ficha.tipoTrabalho) {
            throw new Error("Campos obrigatórios não preenchidos");
        }

        // Formatação ABNT
        let fichaFormatada = `${this.ficha.titulo}`;
        
        if (this.ficha.subtitulo) {
            fichaFormatada += ` : ${this.ficha.subtitulo}`;
        }
        
        fichaFormatada += ` / ${this.ficha.orientador.nome}`;
        
        if (this.ficha.orientador.titulacao) {
            fichaFormatada += `, ${this.ficha.orientador.titulacao}`;
        }
        
        if (this.ficha.coorientador) {
            fichaFormatada += ` ; ${this.ficha.coorientador.nome}`;
            if (this.ficha.coorientador.titulacao) {
                fichaFormatada += `, ${this.ficha.coorientador.titulacao}`;
            }
        }
        
        fichaFormatada += `. -- ${this.ficha.ano}.`;
        
        if (this.ficha.folhas) {
            fichaFormatada += `\n${this.ficha.folhas} f.`;
        }
        
        if (this.ficha.ilustracao) {
            fichaFormatada += ` : ${this.ficha.ilustracao}`;
        }
        
        fichaFormatada += `\n\nTrabalho de ${this.ficha.tipoTrabalho} (${this.ficha.unidade})`;
        
        if (this.ficha.palavrasChave.length > 0) {
            fichaFormatada += `\n\nPalavras-chave: ${this.ficha.palavrasChave.join(', ')}`;
        }
        
        if (this.ficha.fonte) {
            fichaFormatada += `\nFonte: ${this.ficha.fonte}`;
        }

        return fichaFormatada;
    }
}

// DOM Manipulation
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('fichaForm');
    const coorientadorGroup = document.getElementById('coorientadorGroup');
    const btnAddCoorientador = document.getElementById('btnAddCoorientador');
    const palavrasChaveContainer = document.getElementById('palavrasChaveContainer');
    const btnAddKeyword = document.getElementById('btnAddKeyword');
    const fichaResult = document.getElementById('fichaResult');
    const fichaContent = document.getElementById('fichaContent');
    const btnCopy = document.getElementById('btnCopy');

    let keywordCount = 1;

    // Mostrar/ocultar coorientador
    btnAddCoorientador.addEventListener('click', function() {
        coorientadorGroup.style.display = coorientadorGroup.style.display === 'none' ? 'flex' : 'none';
        btnAddCoorientador.textContent = coorientadorGroup.style.display === 'none' ? 
            '+ Adicionar Coorientador' : '- Remover Coorientador';
    });

    // Adicionar campos de palavras-chave
    btnAddKeyword.addEventListener('click', function() {
        if (keywordCount >= 5) return;
        
        keywordCount++;
        const newRow = document.createElement('div');
        newRow.className = 'keyword-row';
        newRow.innerHTML = `
            <input type="text" class="keyword-input" placeholder="Ex.: ${['Redes Sociais', 'Universidade', 'Pesquisa'][keywordCount-2] || 'Novo Termo'}">
            <span class="keyword-number">${keywordCount}${keywordCount === 1 ? 'ª' : keywordCount === 2 ? 'ª' : 'ª'}</span>
        `;
        palavrasChaveContainer.appendChild(newRow);
    });

    // Gerar ficha
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const builder = new FichaBuilder()
            .setTitulo(document.getElementById('titulo').value)
            .setSubtitulo(document.getElementById('subtitulo').value)
            .setOrientador(
                document.getElementById('orientador').value,
                document.getElementById('titulacaoOrientador').value
            )
            .setCoorientador(
                document.getElementById('coorientador')?.value,
                document.getElementById('titulacaoCoorientador')?.value
            )
            .setAno(document.getElementById('ano').value)
            .setFolhas(document.getElementById('folhas').value)
            .setIlustracao(document.getElementById('ilustracao').value)
            .setUnidade(document.getElementById('unidade').value)
            .setTipoTrabalho(document.querySelector('input[name="tipoTrabalho"]:checked').value)
            .setFonte(document.getElementById('fonte').value);

        // Adicionar palavras-chave
        document.querySelectorAll('.keyword-input').forEach(input => {
            if (input.value) builder.addPalavraChave(input.value);
        });

        try {
            const ficha = builder.build();
            fichaContent.textContent = ficha;
            fichaResult.style.display = 'block';
        } catch (error) {
            alert(error.message);
        }
    });

    // Copiar ficha
    btnCopy.addEventListener('click', function() {
        navigator.clipboard.writeText(fichaContent.textContent)
            .then(() => alert('Ficha copiada para a área de transferência!'))
            .catch(err => console.error('Erro ao copiar:', err));
    });
});