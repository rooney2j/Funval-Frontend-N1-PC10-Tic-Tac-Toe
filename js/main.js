const container_all = document.querySelector('.container-all');
const spaces = document.querySelectorAll('.space');
const restart = document.querySelector('.btn.restart');
let posSpaces = [0, 1, 2, 3, 4, 5, 6, 7, 8];
const TURN_X = 'place-x';
const TURN_O = 'place-o';
const WINNING_COMBOS = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];
const board = document.getElementById('board');

posSpaces = [];
let scores = { scoreX: 0, ties: 0, scoreO: 0 };
getStorage();
let oTurn;

//console.log(spaces)

function startGame(currentGame) {
  if (document.querySelector('.conclusion-strip') == true) {
    document.querySelector('.conclusion-strip').remove();
  }

  oTurn = false;
  let currentTurn = oTurn ? TURN_O : TURN_X;
  posSpaces = [0, 1, 2, 3, 4, 5, 6, 7, 8];
  spaces.forEach((space) => {
    space.classList.remove('place-x', 'place-o', 'clicked');
  })
  document.querySelector('.game-board').classList.add('x');
  currentGame.gameResult = '';

  drawScores();
  swapTurnMsg();
  restart.addEventListener('click', btnRestart);

  if (currentGame.gameType == 'player') {
    spaces.forEach((space) => {
      space.addEventListener('click', handleClick, { once: true });
    })
  } else if (currentGame.playerChoice == 'o') {
    cpuTurn(currentGame);
  } else {
    playerTurn(currentGame);
  }
}

function handleClick(e) {
  const space = e.target;
  let currentTurn = oTurn ? TURN_O : TURN_X;

  placeMark(space, currentTurn);

  // elimina el movimiento que hizo el usuario en el arreglo de movimientos
  let spaceNum = getSpaceNumber(e.target);
  let isSameNumber = (el) => el == spaceNum;

  posSpaces.splice(posSpaces.findIndex(isSameNumber), 1);
  e.target.removeEventListener('click', handleClick, { once: true });
  checkEndgame(currentTurn);

  if (currentGame.gameType == 'cpu' && currentGame.gameResult == '') {
    swapTurns();
    cpuTurn(currentGame);
  } else {
    swapTurns();
  }
}
function cpuTurn(currentGame) {
  let currentTurn = oTurn ? TURN_O : TURN_X;
  if (posSpaces.length > 0) {
    let cpuMove;
    cpuMove = randomValidInteger();
    let cpuSelector = '.space.a' + posSpaces[cpuMove];
    let cpuSpace = document.querySelector(cpuSelector);

    cpuSpace.removeEventListener('click', handleClick, { once: true });
    placeMark(cpuSpace, currentTurn);
    posSpaces.splice(cpuMove, 1);
    checkEndgame(currentTurn);
    swapTurns();
    playerTurn();
  }
}

function playerTurn() {
  let currentTurn = oTurn ? TURN_O : TURN_X;
  posSpaces.forEach((el) => {
    let playerSelector = '.space.a' + el;
    let playerSpace = document.querySelector(playerSelector);
    playerSpace.addEventListener('click', handleClick, { once: true });
  })
}

function getSpaceNumber(e) {
  let result = Array.from(e.classList).filter((number) => number >= 0);
  return result[0];
}

function randomValidInteger() {
  const min = 0;
  const max = posSpaces.length - 1;
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function placeMark(space, currentTurn) {
  space.classList.add(currentTurn);
  space.classList.add('clicked');
}

function swapTurns() {
  oTurn = !oTurn;
  const turnWho = document.querySelector('.container-card.game-board').classList;
  oTurn ? turnWho.remove('x') : turnWho.add('x');
  swapTurnMsg();
}

function swapTurnMsg() {
  // intercambia el turno
  const turnMsg = document.querySelector('.display-turn').classList;
  oTurn ? turnMsg.remove('x') : turnMsg.add('x');
}

function checkWin(currentTurn) {
  return WINNING_COMBOS.some((combination) => {
    return combination.every((index) => {
      return spaces[index].classList.contains(currentTurn);
    })
  })
}

function checkDraw() {
  return [...spaces].every((space) => {
    return space.classList.contains(TURN_O) || space.classList.contains(TURN_X);
  })
}

function checkEndgame(currentTurn) {
  if (checkWin(currentTurn) && currentTurn == 'place-o') {
    anounceWin(currentTurn);
  } else if (checkWin(currentTurn) && currentTurn == 'place-x') {
    anounceWin(currentTurn);
  } else if (checkDraw()) {
    anounceDraw(checkDraw());
  }
}

function anounceDraw(tie) {
  if ((tie = true)) {
    const newDiv = document.createElement('div');
    container_all.appendChild(newDiv).classList.add('conclusion-strip', 'draw');
    const strip = document.querySelector('.conclusion-strip');
    strip.innerHTML = `
      <div class="conclusion-strip draw">
      <div class="msg">ROUND TIED</div>
      <div class="select-next">
        <div class="btn no">QUIT</div>
        <div class="btn yes">NEXT ROUND</div>
      </div>
      </div>
    `;
    container_all.style.backgroundColor = '#141f26';
    const nextRound = document.querySelector('.yes');
    spaces.forEach((space) => {
      space.removeEventListener('click', handleClick, { once: true });
    })
    scores.ties++;
    currentGame.gameResult = 't';
    posSpaces = [];
    pushStorage(scores);
    nextRound.addEventListener('click', () => {
      startGame(currentGame);
      strip.remove();
      container_all.style.backgroundColor = '#1a2a33';
    })
    const quit = document.querySelector('.no');
    quit.addEventListener('click', () => {
      strip.remove();
      container_all.style.backgroundColor = '#1a2a33';
      starting.classList.add('active');
      playing.classList.remove('active');
    })
  }
}
function anounceWin(currentTurn) {
  const newDiv = document.createElement('div');
  if (currentTurn == 'place-x') {
    container_all.appendChild(newDiv).classList.add('conclusion-strip', 'xwins');
    const strip = document.querySelector('.conclusion-strip');
    strip.innerHTML = `
      <div class="msg">
        <img src="./iconos/icon-x.svg" alt="winner-x" /> TAKES THE ROUND
      </div>
      <div class="select-next">
        <div class="btn no">QUIT</div>
        <div class="btn yes">NEXT ROUND</div>
      </div>
    `;
    container_all.style.backgroundColor = '#141f26';
    spaces.forEach((space) => {
      space.removeEventListener('click', handleClick, { once: true });
    })
    scores.scoreX++;
    currentGame.gameResult = 'x';
    posSpaces = [];
    pushStorage(scores);
    const nextRound = document.querySelector('.yes');
    nextRound.addEventListener('click', () => {
      startGame(currentGame);
      strip.remove();
      container_all.style.backgroundColor = '#1a2a33';
    })
    const quit = document.querySelector('.no');
    quit.addEventListener('click', () => {
      strip.remove();
      container_all.style.backgroundColor = '#1a2a33';
      starting.classList.add('active');
      playing.classList.remove('active');
    })
  } else if (currentTurn == 'place-o') {
    container_all.appendChild(newDiv).classList.add('conclusion-strip', 'owins');
    const strip = document.querySelector('.conclusion-strip');
    strip.innerHTML = `
      <div class="msg">
        <img src="./iconos/icon-o.svg" alt="winner-o" /> TAKES THE ROUND
      </div>
      <div class="select-next">
        <div class="btn no">QUIT</div>
        <div class="btn yes">NEXT ROUND</div>
      </div>
    `;
    container_all.style.backgroundColor = '#141f26';
    spaces.forEach((space) => {
      space.removeEventListener('click', handleClick, { once: true });
    })
    scores.scoreO++;
    pushStorage(scores);
    currentGame.gameResult = 'o';
    posSpaces = [];
    const nextRound = document.querySelector('.yes');
    nextRound.addEventListener('click', () => {
      startGame(currentGame);
      strip.remove();
      container_all.style.backgroundColor = '#1a2a33';
    })
    const quit = document.querySelector('.no');
    quit.addEventListener('click', () => {
      strip.remove();
      container_all.style.backgroundColor = '#1a2a33';
      starting.classList.add('active');
      playing.classList.remove('active');
    })
  }
}
function btnRestart() {
  const newDiv = document.createElement('div');
  container_all.appendChild(newDiv).classList.add('conclusion-strip', 'draw');
  const strip = document.querySelector('.conclusion-strip');
  strip.innerHTML = `
      <div class="conclusion-strip draw">
      <div class="msg">¿RESTART GAME?</div>
      <div class="select-next">
        <div class="btn no">NO, CANCEL</div>
        <div class="btn yes">YES, RESTART</div>
      </div>
      </div>
    `;
  container_all.style.backgroundColor = '#141f26';
  const yesRestart = document.querySelector('.yes');
  yesRestart.addEventListener('click', () => {
    strip.remove();
    container_all.style.backgroundColor = '#1a2a33';
    starting.classList.add('active');
    playing.classList.remove('active');
  })
  const noCancel = document.querySelector('.no');
  noCancel.addEventListener('click', () => {
    strip.remove();
    container_all.style.backgroundColor = '#1a2a33';
  })
}
