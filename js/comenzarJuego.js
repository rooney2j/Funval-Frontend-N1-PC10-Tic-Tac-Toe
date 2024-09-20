const starting = document.querySelector('.state-start');
const playing = document.querySelector('.game-board');

const btnCPU = document.querySelector('.btn.newg.cpu');
const btnPlayer = document.querySelector('.btn.newg.player');
const currentGame = {
    gameType: '',
    playerChoice: 'x',
    gameResult: 't'
};

// iniciar el juego
starting.classList.add('active');
playing.classList.remove('active');

// por defecto comienza quien eligió X
const optionX = document.querySelector('.player-mark.type-x');
const optionO = document.querySelector('.player-mark.type-o');
optionX.style.filter = 'brightness = 1';
optionO.style.filter = 'brightness = 1';

optionX.addEventListener('click', function () {
    currentGame.playerChoice = 'x';
})

optionO.addEventListener('click', function () {
    currentGame.playerChoice = 'o'
})

btnPlayer.addEventListener('click', function () {
    currentGame.gameType = 'player'
    cssGameSwitch()
    drawPlayer()
    startGame(currentGame)
})

btnCPU.addEventListener('click', function () {
    currentGame.gameType = 'cpu'
    cssGameSwitch()
    drawPlayer()
    startGame(currentGame)
})

function cssGameSwitch() {
    starting.classList.remove('active')
    playing.classList.add('active')
}

function getStorage() {
    if (localStorage.length > 2) {
        scores.scoreX = localStorage.scoreX
        scores.ties = localStorage.ties
        scores.scoreO = localStorage.scoreO
    } else {
        scores = { scoreX: 0, ties: 0, scoreO: 0 }
    }
}

function pushStorage() {
    localStorage.setItem('scoreX', scores.scoreX)
    localStorage.setItem('ties', scores.ties)
    localStorage.setItem('scoreO', scores.scoreO)
}

function drawScores() {
    document.querySelector('.scoreX .score-value').innerText = scores.scoreX
    document.querySelector('.scoreTies .score-value').innerText = scores.ties
    document.querySelector('.scoreO .score-value').innerText = scores.scoreO
}

function drawPlayer() {
    const userX = document.querySelector('.scoreX .current-mark')
    const userO = document.querySelector('.scoreO .current-mark')
    if (currentGame.playerChoice == 'x') {
        userX.innerText = 'X (YOU)'
        if (currentGame.gameType == 'player') {
            userO.innerText = 'O (Player 2)'
        } else if (currentGame.gameType == 'cpu') {
            userO.innerText = 'O (CPU)'
        }
    } else if (currentGame.playerChoice == 'o') {
        userO.innerText = 'O (YOU)'
        if (currentGame.gameType == 'player') {
            userX.innerText = 'O (Player 2)'
        } else if (currentGame.gameType == 'cpu') {
            userX.innerText = 'O (CPU)'
        }
    }
}
