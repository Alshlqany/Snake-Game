"use strict";

// Html Elements
const playBoard = document.querySelector(".play-board"),
  scoreEl = document.querySelector(".score"),
  highScoreEl = document.querySelector(".high-score");

let intervalId,
  foodX,
  foodY,
  headX = 10,
  headY = 10,
  body = [],
  updateX = 0,
  updateY = 0,
  score = 0,
  highScore = localStorage.getItem("high-score") || 0,
  gameOver = false;

document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowUp" && updateY !== 1) {
    updateX = 0;
    updateY = -1;
  } else if (e.key === "ArrowDown" && updateY !== -1) {
    updateX = 0;
    updateY = 1;
  } else if (e.key === "ArrowLeft" && updateX !== 1) {
    updateX = -1;
    updateY = 0;
  } else if (e.key === "ArrowRight" && updateX !== -1) {
    updateX = 1;
    updateY = 0;
  }
});

function changFoodPosition() {
  foodX = Math.floor(Math.random() * 30) + 1;
  foodY = Math.floor(Math.random() * 30) + 1;
  // show the new food in
  body.forEach((e) => {
    if (foodX === e[0] && foodY === e[1]) {
      changFoodPosition();
    }
  });
}

function gameOverHandler() {
  alert("game Over");
  clearInterval(intervalId);
  location.reload();
}

const game = () => {
  if (gameOver) {
    return gameOverHandler();
  }

  // update scores
  scoreEl.innerHTML = `Score: ${score}`;
  highScoreEl.innerHTML = `High score: ${highScore}`;
  localStorage.setItem("high-score", highScore);

  // when the snake eat the food
  if (headX === foodX && headY === foodY) {
    score++;
    highScore = Math.max(score, highScore); // update highScore value with the max score
    changFoodPosition();
    body.push([0, 0]);
  }

  let htmlMarkUp = `
  <div class=
  'food' style="grid-area: ${foodY} / ${foodX}"></div>
  `;

  // shift the snake body one cell
  for (let i = body.length - 1; i > 0; i--) {
    body[i] = body[i - 1];
  }

  body[0] = [headX, headY];

  // update snake head position
  headX += updateX;
  headY += updateY;

  // make gameOver = true when the snake hits the wall
  if (headX <= 0 || headY <= 0 || headY > 30 || headX > 30) gameOver = true;

  // adding every part of snake body
  for (let i = 0; i < body.length; i++) {
    htmlMarkUp += `<div class='snake-body' style="grid-area: ${body[i][1]} / ${body[i][0]}"></div>`;
    // make gameOver = true when when the snake hits itself
    if (body[0][1] === body[i][1] && body[0][0] === body[i][0] && i != 0)
      gameOver = true;
  }

  playBoard.innerHTML = htmlMarkUp;
};

changFoodPosition();
intervalId = setInterval(game, 125);
