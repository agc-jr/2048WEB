let score = 0;
let hiscore = 0;

// Função para atualizar a pontuação na tela
function updateScore(points) {
    score += points; // Incrementar o score
    document.getElementById('score').textContent = score; // Atualizar o HTML      
    if(parseInt(score) > parseInt(hiscore)){
        updateHiscore();
    }
}

function updateHiscore(){    
    hiscore = score;
    document.getElementById('hiscore').textContent = score; // Atualizar o HTML       
}

const gameBoard = document.getElementById('game-board');
let board = [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0]
];

// Função para inicializar o jogo e gerar duas peças no início
function initializeGame() {
    addNewTile();
    addNewTile();
    updateBoard();
}

// Função para adicionar uma nova peça em uma posição aleatória
function addNewTile() {
    let emptyTiles = [];
    for (let row = 0; row < 4; row++) {
        for (let col = 0; col < 4; col++) {
            if (board[row][col] === 0) {
                emptyTiles.push({ row: row, col: col });
            }
        }
    }

    if (emptyTiles.length > 0) {
        let randomTile = emptyTiles[Math.floor(Math.random() * emptyTiles.length)];
        board[randomTile.row][randomTile.col] = Math.random() > 0.1 ? 2 : 4;
    }
}

// Função para atualizar o tabuleiro na interface
function updateBoard() {
    gameBoard.innerHTML = ''; // Limpar o tabuleiro

    // Adicionar as células vazias
    for (let row = 0; row < 4; row++) {
        for (let col = 0; col < 4; col++) {
            let emptyCell = document.createElement('div');
            emptyCell.classList.add('cell');
            gameBoard.appendChild(emptyCell);
        }
    }

    // Adicionar as peças reais no lugar correto
    for (let row = 0; row < 4; row++) {
        for (let col = 0; col < 4; col++) {
            let tileValue = board[row][col];
            if (tileValue > 0) {
                let tile = document.createElement('div');
                tile.classList.add('tile');
                tile.textContent = tileValue;
                tile.classList.add(`tile-${tileValue}`);

                // Adicionar a peça no gameBoard com a posição correta
                tile.style.left = `${col * 120}px`;  // 100px para o tamanho da célula + 10px para o gap
                tile.style.top = `${row * 120}px`;

                if (isMerged[row][col]) {
                    tile.classList.add('tile-merge');
                    isMerged[row][col] = false; // Reinicia o estado após animar
                }

                gameBoard.appendChild(tile);
            }
        }
    }
}



let isMerged = [
    [false, false, false, false],
    [false, false, false, false],
    [false, false, false, false],
    [false, false, false, false]
];
/*
// Atualize a função combine para marcar mesclagens
function combine(row) {
    for (let i = 0; i < 3; i++) {
        if (row[i] === row[i + 1] && row[i] !== 0) {
            row[i] *= 2;    
            row[i + 1] = 0;
            isMerged[row][i] = true; // Marca que essa célula foi combinada
        }
    }
    return row;
}
*/


// Event listeners para capturar as setas do teclado
document.addEventListener('keydown', function(event) {
    if (event.key === 'ArrowLeft') {
        moveLeft();
        setTimeout(() => {
            addNewTile();
            updateBoard();
            // Verificar o fim de jogo
            checkGameOver();
        }, 200); // Espera a animação terminar
    } else if (event.key === 'ArrowRight') {
        moveRight();
        setTimeout(() => {
            addNewTile();
            updateBoard();
            // Verificar o fim de jogo
            checkGameOver();
        }, 200);
    } else if (event.key === 'ArrowUp') {
        moveUp();
        setTimeout(() => {
            addNewTile();
            updateBoard();
            // Verificar o fim de jogo
            checkGameOver();
        }, 200);
    } else if (event.key === 'ArrowDown') {
        moveDown();
        setTimeout(() => {
            addNewTile();
            updateBoard();
            // Verificar o fim de jogo
            checkGameOver();
        }, 200);
    }
});

initializeGame();

function slide(row) {
    let newRow = row.filter(val => val); // Remove os zeros
    let missing = 4 - newRow.length; // Calcula quantos zeros são necessários
    let zeros = Array(missing).fill(0); // Cria a lista de zeros
    return newRow.concat(zeros); // Junta a nova linha com zeros no final
}

function combine(row) {
    /*for (let i = 0; i < 3; i++) {
        if (row[i] === row[i + 1] && row[i] !== 0) {
            row[i] *= 2;
            row[i + 1] = 0;
        }
    }
    return row;*/

    let pointsEarned = 0; // Armazena os pontos ganhos nesta combinação

    for (let i = 0; i < row.length - 1; i++) {
        if (row[i] !== 0 && row[i] === row[i + 1]) {
            row[i] *= 2; // Duplicar o valor
            pointsEarned += row[i]; // Adicionar à pontuação acumulada
            row[i + 1] = 0; // Remover a célula combinada
        }
    }

    return { newRow: row, points: pointsEarned };
}

function moveLeft() {
    /*for (let i = 0; i < 4; i++) {
        board[i] = slide(board[i]);
        board[i] = combine(board[i]);
        board[i] = slide(board[i]);        
    }*/
    let totalPoints = 0; // Armazena a pontuação total deste movimento

    for (let i = 0; i < 4; i++) {
        board[i] = slide(board[i]); // Primeiro slide para a esquerda

        // Obter a linha combinada e os pontos ganhos
        const { newRow, points } = combine(board[i]);
        board[i] = newRow; // Atualizar o tabuleiro com a linha combinada
        totalPoints += points; // Acumular os pontos deste movimento

        board[i] = slide(board[i]); // Segundo slide após combinação
    }

    // Adicionar os pontos totais ao score
    updateScore(totalPoints);

    
}


function moveRight() {
    /*for (let i = 0; i < 4; i++) {
        board[i] = board[i].reverse(); // Inverte a linha
        board[i] = slide(board[i]);
        board[i] = combine(board[i]);
        board[i] = slide(board[i]);
        board[i] = board[i].reverse(); // Volta a inverter para restaurar
    }*/

    let totalPoints = 0; // Armazena a pontuação total deste movimento

    for (let i = 0; i < 4; i++) {
        board[i] = board[i].reverse();
        board[i] = slide(board[i]); // Primeiro slide para a esquerda

        // Obter a linha combinada e os pontos ganhos
        const { newRow, points } = combine(board[i]);
        board[i] = newRow; // Atualizar o tabuleiro com a linha combinada
        totalPoints += points; // Acumular os pontos deste movimento

        board[i] = slide(board[i]); // Segundo slide após combinação
        board[i] = board[i].reverse(); 
    }

    // Adicionar os pontos totais ao score
    updateScore(totalPoints);


}


function transpose(board) {
    let newBoard = [
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0]
    ];
    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
            newBoard[i][j] = board[j][i];
        }
    }
    return newBoard;
}

function moveUp() {
    board = transpose(board); // Transpõe para tratar como linhas
    moveLeft(); // Aplica a lógica de mover para a esquerda nas colunas
    board = transpose(board); // Volta a transpor para restaurar
}

function moveDown() {
    board = transpose(board); // Transpõe para tratar como linhas
    moveRight(); // Aplica a lógica de mover para a direita nas colunas
    board = transpose(board); // Volta a transpor para restaurar
}

document.addEventListener('keydown', function(event) {
    if (event.key === 'ArrowLeft') {
        moveLeft();
        addNewTile();
        updateBoard();
    } else if (event.key === 'ArrowRight') {
        moveRight();
        addNewTile();
        updateBoard();
    } else if (event.key === 'ArrowUp') {
        moveUp();
        addNewTile();
        updateBoard();
    } else if (event.key === 'ArrowDown') {
        moveDown();
        addNewTile();
        updateBoard();
    }
});


function checkGameOver() {
    // Verificar se o jogador venceu
    for (let row = 0; row < 4; row++) {
        for (let col = 0; col < 4; col++) {
            if (board[row][col] === 2048) {
                showEndMessage("Você venceu!");
                return;
            }
        }
    }

    // Verificar se há células vazias ou movimentos possíveis
    for (let row = 0; row < 4; row++) {
        for (let col = 0; col < 4; col++) {
            if (board[row][col] === 0) return; // Ainda há espaço vazio

            // Verificar se há movimento possível (mesma peça adjacente)
            if (col < 3 && board[row][col] === board[row][col + 1]) return; // Movimento horizontal
            if (row < 3 && board[row][col] === board[row + 1][col]) return; // Movimento vertical
        }
    }

    // Se não houver mais movimentos possíveis
    showEndMessage("Fim de jogo! Você perdeu.");
}

function showEndMessage(message) {
    const messageBox = document.getElementById('game-over-message');
    const messageText = document.getElementById('game-over-text');
    messageText.textContent = message;
    messageBox.style.display = 'block';
}

// Função para reiniciar o jogo
function restartGame() {
    // Esconder a mensagem de fim de jogo
    document.getElementById('game-over-message').style.display = 'none';
    
    // Reiniciar o tabuleiro
    startNewGame();
}

function startNewGame() {
    score = 0; // Zerar o score
    document.getElementById('score').textContent = score; // Atualizar o HTML

    // Limpar o tabuleiro
    for (let row = 0; row < 4; row++) {
        for (let col = 0; col < 4; col++) {
            board[row][col] = 0; // Resetar todas as possibilidades para 0 (vazio)
        }
    }

    // Limpar o estado de mesclagem
    for (let row = 0; row < 4; row++) {
        for (let col = 0; col < 4; col++) {
            isMerged[row][col] = false; // Resetar a mesclagem
        }
    }

    // Gerar duas peca iniciais aleatoias
    generateRandomTile();
    generateRandomTile();

    // Atualizar o tabuleiro visualmente
    updateBoard();
}

// Funcao para gerar uma peca aleatoia no tabuleiro
function generateRandomTile() {
    let emptyCells = [];

    // Encontrar todas as células vazias
    for (let row = 0; row < 4; row++) {
        for (let col = 0; col < 4; col++) {
            if (board[row][col] === 0) {
                emptyCells.push({ row: row, col: col });
            }
        }
    }

    // Se não há mais células vazias, não faz nada
    if (emptyCells.length === 0) return;

    // Escolher uma célula aleatória
    let randomIndex = Math.floor(Math.random() * emptyCells.length);
    let cell = emptyCells[randomIndex];

    // Definir o valor da peça (90% chance de 2, 10% chance de 4)
    board[cell.row][cell.col] = Math.random() < 0.9 ? 2 : 4;
}

// Quando a página for carregada, iniciar o jogo
window.onload = () => {
    startNewGame();
};

// Ou quando o botão "Reiniciar" for clicado
function restartGame() {
    document.getElementById('game-over-message').style.display = 'none';
    startNewGame();
}