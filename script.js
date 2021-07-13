///////////////////////////////////////////////////////////Const and global var 

// Screens
const sectionMain = document.getElementById("main");
const sectionHome = document.getElementById("home");

//Infos
const scoreElement = document.getElementById("score");
const modeElement = document.getElementById("mode");
const highscoreElement = document.getElementById("highscore");
const playtimeElement = document.getElementById("playtime");

//Grid and moles
const grid = document.getElementById("grid");
const moles = document.querySelectorAll(".moleContainer");

//Buttons
const restartButton = document.getElementById("restart");
const easyButton = document.getElementById("easy");
const classicButton = document.getElementById("classic");
const hardcoreButton = document.getElementById("hardcore");
const backButton = document.getElementById("back");

//Modal
const modal = document.getElementById("modal");
const span = document.getElementsByClassName("close")[0];

//Cursor
const cursor = document.getElementById("cursor");

//Audio
const music = document.getElementById("background-music");
const hit = document.getElementById("hit");
const miss = document.getElementById("miss");
const win = document.getElementById("win");
const gameover = document.getElementById("gameover");
const button = document.getElementById("button");

const gameCoeff = {
    easy: 1.1,
    classic: 1.15,
    hardcore: 1.3
}

const gameWinningPointsToReach = {
    easy: 3000,
    classic: Number.MAX_VALUE,
    hardcore: Number.MAX_VALUE
}

//Francois : better to create Object Game ?
let numberOfClicksBeforeLevelUp = 10;
let winningScore = 1000;
let startTime = new Date();
let playtime = 0;
let generationPeriod = 1000;
let coeff = 1.10;
let molesClickCounter = 0;
let score = 0;
let level = 1;
let gameOn = false;
let highscore = 2000;
let mode = "easy";

let intervalId = 0;
let timeIntervalId = 0;
// Music setup
music.volume = 0.1;
hit.volume = 0.1;
miss.volume = 0.1;
button.volume = 0.1;
win.volume = 0.15;
gameover.volume = 0.15;

//////////////////////////////////////////////////////////Event listeners
moles.forEach((item) => item.addEventListener('click', killMole));

restartButton.onclick = function () {
    startGame();
    button.play();
};

backButton.onclick = function () {
    hideMainGame();
    stopGame();
    button.play();
};

easyButton.onclick = function () {
    hideHome();
    coeff = gameCoeff.easy;
    winningScore = gameWinningPointsToReach.easy;
    mode = "easy";
    startGame();
    button.play();
};

classicButton.onclick = function () {
    hideHome();
    coeff = gameCoeff.classic;
    winningScore = gameWinningPointsToReach.classic;
    mode = "classic";
    startGame();
    button.play();
};

hardcoreButton.onclick = function () {
    hideHome();
    coeff = gameCoeff.hardcore;
    winningScore = gameWinningPointsToReach.hardcore;
    mode = "hardcore";
    startGame();
    button.play();
};

//////////////////////////////////////////////Functions

function hideHome() {
    sectionHome.classList.add("hidden");
    sectionMain.classList.remove("hidden");
}

function hideMainGame() {
    sectionHome.classList.remove("hidden");
    sectionMain.classList.add("hidden");
}

function initMolesClasses() {
    moles.forEach((child) => child.classList.remove("getInSlow"));
    moles.forEach((child) => child.classList.remove("active"));
    moles.forEach((child) => child.classList.remove("getOut"));
    moles.forEach((child) => child.classList.remove("getIn"));

}


function moleGetInSlow() {
    moles.forEach((child) => child.classList.add("getInSlow"));
    moles.forEach((child) => child.classList.remove("active"));
    moles.forEach((child) => child.classList.remove("getOut"));
}

function moleGetOut(mole) {
    mole.classList.add("active");
    mole.classList.add("getOut");
    mole.classList.remove("getIn");
    mole.querySelectorAll(".eye").forEach((item) => item.classList.remove("scaredEye"));
    // mole.querySelectorAll(".mouth").forEach((item) => item.classList.remove("scaredMouth"));


}

function moleGetIn(mole) {
    mole.classList.remove("active");
    mole.classList.add("getIn");
    mole.classList.remove("getOut");
    mole.querySelectorAll(".eye").forEach((item) => item.classList.add("scaredEye"));
    // mole.querySelectorAll(".mouth").forEach((item) => item.classList.add("scaredMouth"));

}


function killMole(event) {
    let mole = event.currentTarget;

    if (gameOn === true && mole.classList.contains("active")) {
        increaseScore();
        moleGetIn(mole);
        updateInfo();
        hit.play();
        molesClickCounter++;
    }
    if (checkGameEnd()) {
        clearInterval(intervalId);
        clearInterval(timeIntervalId);
    };
    miss.play();
}

function increaseScore() {
    let divider = generationPeriod / 10000;
    score += Math.floor(1/ (divider ** 2));
    return score;
}

function updateInfo() {
    updateScore();
    updateMode();
    updateTime();
    updateHighscore();
}

function updateScore() {
    scoreElement.innerHTML = 'Score: ' + score + "pts";
}

function updateMode() {
    modeElement.innerHTML = 'Mode: ' + mode;
}

function updateHighscore() {
    highscoreElement.innerHTML = 'Highscore: ' + highscore + "pts";
}

function updateTime() {
    playtimeElement.innerHTML = 'Playtime: ' + playtime + "s";
}

function countPlaytime() {
     timeIntervalId = setInterval( () => {
        playtime = Math.floor((new Date() - startTime) / 1000);
        updateTime();
    }, 500)
}

function randomHoleSelector() {
    const molesLeft = document.querySelectorAll(".moleContainer:not(.active)");
    if (molesLeft.length === 0) {
        return undefined;
    } else {
        return molesLeft[Math.floor(Math.random() * molesLeft.length)];
    }
}

function startGame() {
    initGame();
    runGame();
}

function runGame() {
    intervalId = setInterval(() => {
        let randomMole = randomHoleSelector();

        if (randomMole !== undefined) {
            moleGetOut(randomMole);
        }
        if (molesClickCounter > numberOfClicksBeforeLevelUp) {
            molesClickCounter = 0;
            level++;
            generationPeriod = generationPeriod / coeff ;
            clearInterval(intervalId);
            console.log("generationPeriod in interval function", generationPeriod);
            runGame(generationPeriod);
        }

        checkGameEnd();

    }, generationPeriod)

    return intervalId;
}

function checkGameEnd() {
    const holesLeft = document.querySelectorAll(".moleContainer:not(.active)");

    if ((holesLeft.length === 0 || score >= winningScore)) {
        stopGame();
        return true;
    }
}

function stopGame() {
    const holesLeft = document.querySelectorAll(".moleContainer:not(.active)");
    music.pause();

    displayEndgameModal(holesLeft);

    //Push mole transition back to position
    setTimeout(moleGetInSlow,500);

    clearInterval(intervalId);
    clearInterval(timeIntervalId);
    updateInfo();
    gameOn = false;
}

function displayEndgameModal(holesLeft) {
    if (gameOn ===true) {
        if (holesLeft.length ===0) {
            if (isHighscore()) {
                win.play();
                displayModalHiscore();
            } else {
                displayModalYouLose();
                gameover.play();
            }
        } else if (score >= winningScore) {
            win.play();
            isHighscore(score);
            displayModalYouWin();
        }
    }
}

function initGame() {
    startTime = new Date();
    generationPeriod = 1000;
    molesClickCounter = 0;
    playtime = 0;
    score = 0;
    level = 1;
    gameOn = true;
    clearInterval(intervalId);
    clearInterval(timeIntervalId);
    countPlaytime();
    initMolesClasses();
    updateInfo();
    music.play();
}

function isHighscore() {
    if (score > highscore) {
        saveHighscore();
        return true;
    }
}

function saveHighscore() {
    highscore = score;
}

//YOU WIN
function displayModalYouWin() {
    modal.style.display = "block";
    modal.querySelector("p").innerText = `You Win !!!
    
    Try a harder mode =D`;
}
//Highscore !
function displayModalHiscore() {
    modal.style.display = "block";
    modal.querySelector("p").innerText = `Highscore !!!
    Score : ${score} pts
    Playtime : ${playtime}s`;
}

// YOU LOSE MODAL
function displayModalYouLose() {
    modal.style.display = "block";
    modal.querySelector("p").innerText = `You lose !
    Score : ${score} pts
    Playtime : ${playtime}s`;
}

span.onclick = function () {
    modal.style.display = "none";
}

window.onmousemove = function(e){
    // console.log("move", e.clientX, e.clientY);
    cursor.style.left = e.clientX - 15 + 'px';
    cursor.style.top = e.clientY - 45 + 'px';
}

window.onclick = function(e){
    // console.log("move", e.clientX, e.clientY);
    cursor.classList.add("hammer-rotate")
    setTimeout( () => cursor.classList.remove("hammer-rotate"), 200)
}
// window.onclick = function (event) {
//     if (event.target == modal) {
//         modal.style.display = "none";
//     }
// }