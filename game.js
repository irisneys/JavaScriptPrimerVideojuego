const canvas = document.querySelector("#game");
const games = canvas.getContext("2d");

const btnUp = document.querySelector('#up')
const btnLeft = document.querySelector('#left')
const btnRight = document.querySelector('#right')
const btnDown = document.querySelector('#down')
const spanLives = document.querySelector("#lives");
const spanTime = document.querySelector("#time");
const spanRecord = document.querySelector("#record");
const pResult = document.querySelector("#result");

let canvasSize;
let elementSize;
let level = 0;
let lives = 3;

let timeStart; 
let timePlayer;
let timeInterval;

const playerPosition = {
  x:undefined,
  y:undefined
}

const giftPosition = {
  x: undefined,
  y: undefined,
};

let enemyPositions = [];

window.addEventListener("load", setCanvasSize);
window.addEventListener("resize", setCanvasSize);



function setCanvasSize(){
  if (window.innerHeight > window.innerWidth) {
    canvasSize = window.innerWidth * 0.8;
  } else {
    canvasSize = window.innerHeight * 0.8;
  }
 
  canvasSize =  Number(canvasSize.toFixed(0)); 
  canvas.setAttribute("width", canvasSize);
  canvas.setAttribute("height", canvasSize);
  
  elementSize = canvasSize / 10;
    
  playerPosition.x = undefined;
  playerPosition.y=undefined;

  startGame();
}


function startGame() {
  console.log({ canvasSize, elementSize });

  games.font = elementSize-6 + "px Verdana";
  games.textAlign = "end";

  const map = maps[level];
  if (!map) {
    gameWin();
    return;    
  }

  if (!timeStart) {
    timeStart = Date.now();
    timeInterval = setInterval(showTime,100);
    showRecord();
    
  }

  const mapRows = map.trim().split('\n');
  const mapRowCols = mapRows.map(row => row.trim().split(''));

  console.log({map, mapRows, mapRowCols})

   showLives();

  enemyPositions = [];  
  games.clearRect(0,0, canvasSize, canvasSize)

  mapRowCols.forEach((row, rowIndex)=> {
    row.forEach((column, columnIndex) => {
    const emoji = emojis[column];
    const positionX = elementSize * (columnIndex + 1);
    const positionY = elementSize * (rowIndex + 1);
    
  
    if (column == "O") {
        if (!playerPosition.x && !playerPosition.y) {
        playerPosition.x = positionX;
        playerPosition.y = positionY;
        console.log({ playerPosition });
        } 
    } else if ((column == "I")) {
      giftPosition.x = positionX;
      giftPosition.y = positionY;
    } else if (column == "X") {
      enemyPositions.push({
        x: positionX,
        y: positionY,
      });
    }    

    games.fillText(emoji, positionX, positionY);
  });    
  });
  
  movePlayer();
  }


function movePlayer() {
  const giftCollisionX = playerPosition.x.toFixed(3) == giftPosition.x.toFixed(3);
  const giftCollisionY = playerPosition.y.toFixed(3) == giftPosition.y.toFixed(3);
  const giftCollision = giftCollisionX && giftCollisionY;

    if (giftCollision) {
      levelWin();
      }

  const enemyCollision = enemyPositions.find(enemy => {
  const enemyCollisionX = enemy.x.toFixed(3) == playerPosition.x.toFixed(3);
  const enemyCollisionY = enemy.y.toFixed(3) == playerPosition.y.toFixed(3);
  return enemyCollisionX && enemyCollisionY;
  });
  
    if (enemyCollision) {
      levelFail();
    }
    
games.fillText(emojis["PLAYER"], playerPosition.x, playerPosition.y);

}

function levelWin(){
  console.log("Subiste de nisvel!");
  level++
  startGame();
}

function levelFail() {
  console.log("Chocaste contra un enemigo :(");

  lives--;

  console.log(lives);

  if (lives <= 0) {
    level = 0;
    lives = 3;
    timeStart =  undefined;
  }

  playerPosition.x = undefined;
  playerPosition.y = undefined;
  startGame();
}

function gameWinAndRecord(){
    console.log("Ganaste el Juego!");
    clearInterval(timeInterval);

    const recordTime = localStorage.getItem("record_time");
    const playerTime = Date.now() - timeStart;

    
      if (recordTime) {
          if (recordTime >=  playerTime) {
          localStorage.setItem('record_time', playerTime );
          pResult.innerHTML ='Aumentaste el reto 😱';
          }else{
            pResult.innerHTML ='Lo siento no superaste el record, intentalo de nuevo... 😎'
          }
      }else{
        localStorage.setItem('record_time', playerTime);
         pResult.innerHTML ="primer record, intenta superarlo 😎";
      }
  console.log({recordTime, playerTime});
}

function showLives() {
  const heartsArray = Array(lives).fill(emojis["HEART"]); // [1,2,3]
  // console.log(heartsArray);

  spanLives.innerHTML = "";
  heartsArray.forEach((heart) => spanLives.append(heart));
}

function showTime(){
  spanTime.innerHTML = Date.now() - timeStart;
}

function showRecord(){
  spanRecord.innerHTML = localStorage.getItem('record_time')
}


window.addEventListener("keydown", moveByKeys);
btnUp.addEventListener('click', moveUp)
btnLeft.addEventListener('click', moveLeft)
btnRight.addEventListener('click', moveRight)
btnDown.addEventListener('click', moveDown)

function moveByKeys(event){
  if (event.key =='ArrowUp') moveUp();
  else if (event.key == 'ArrowLeft') moveLeft();
  else if(event.key == 'ArrowRight') moveRight();
  else if(event.key == 'ArrowDown') moveDown();
}



function moveUp(){
  console.log("quiero mover hacia arriba");
  if (playerPosition.y - elementSize >= 0) {
    playerPosition.y -= elementSize;
  //movePlayer();
  startGame();
   }
  
}
function moveLeft() {
    console.log("quiero mover hacia izquierda");

    if (!((playerPosition.x - elementSize) < elementSize)) {
      playerPosition.x -= elementSize;
      startGame();
    } 
 }

function moveRight() {
    console.log("quiero mover hacia la derecha");
  if (playerPosition.x < canvasSize) {
    playerPosition.x += elementSize;
   startGame();
  }
}
function moveDown() {
  console.log("quiero mover hacia abajo");
   if (playerPosition.y  < canvasSize ) {
    playerPosition.y += elementSize;
   startGame();
   }
  
}
