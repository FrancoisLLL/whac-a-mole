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
const survivalButton = document.getElementById("survival");
const backButton = document.getElementById("back");
const soundButton = document.getElementById("sound");

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
const lvlsound = document.getElementById("lvlsound");
const readygo = document.getElementById("readygo");


//Francois : create object ?
const numberOfClicksBeforeLevelUp = 20;
const numberOfClicksBeforeAcceleration = 5;
const easyInitGenerationPeriod = 1200;
const classicInitGenerationPeriod = 600;
const survivalInitGenerationPeriod = 380;
const classicCoeff = 1.03;

let startTime = new Date();
let playtime = 0;
let generationPeriod = 0;
let coeff = 0;
let molesClickCounter = 0;
let score = 0;
let level = 1;
let gameOn = false;
let highscore = 2000;
let highestlvl = 3;
let mode = "";

let intervalId = 0;
let timeIntervalId = 0;

// Music setup
music.volume = 0.03;
hit.volume = 0.1;
miss.volume = 0.1;
button.volume = 0.1;
win.volume = 0.1;
gameover.volume = 0.15;
lvlsound.volume = 0.05;
readygo.volume = 0.5;



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
    mode = "easy";
    startGame();
    button.play();
};

classicButton.onclick = function () {
    hideHome();
    mode = "classic";
    startGame();
    button.play();
};

survivalButton.onclick = function () {
    hideHome();
    mode = "survival";
    startGame();
    button.play();
};

soundButton.onclick = function () {
    button.play();
    if (soundButton.classList.contains("mute")) {
        music.volume = 0.03;
        hit.volume = 0.1;
        miss.volume = 0.1;
        button.volume = 0.1;
        win.volume = 0.1;
        gameover.volume = 0.15;
        lvlsound.volume = 0.05;
        readygo.volume = 0.5;
        music.play();
        soundButton.classList.remove("mute");
    } else {
        music.volume = 0;
        hit.volume = 0;
        miss.volume = 0;
        setTimeout(() => {
            button.volume = 0;
        }, 100);
        win.volume = 0;
        gameover.volume = 0;
        readygo.volume = 0;
        lvlsound.volume = 0;

        soundButton.classList.add("mute");
    }
};

//////////////////////////////////////////////Functions


function initGameVar() {
    if (mode === "survival") {
        generationPeriod = survivalInitGenerationPeriod;
    } else if (mode === "classic") {
        generationPeriod = classicInitGenerationPeriod;
        coeff = classicCoeff;
    } else {
        generationPeriod = easyInitGenerationPeriod
    }

    molesClickCounter = 0;
    playtime = 0;
    score = 0;
    level = 1;
    gameOn = true;
}

/////////////////////////// SPA
function hideHome() {
    sectionHome.classList.add("hidden");
    sectionMain.classList.remove("hidden");
}

function hideMainGame() {
    sectionHome.classList.remove("hidden");
    sectionMain.classList.add("hidden");
}

///////////////////////// Class for Animations / Transition
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
}

function moleGetIn(mole) {
    mole.classList.remove("active");
    mole.classList.add("getIn");
    mole.classList.remove("getOut");
}

//////////////////////////////// Main functions

function initGame() {
    initGameVar();
    clearInterval(intervalId);
    clearInterval(timeIntervalId);
    initMolesClasses();
    updateInfo();
    music.play();
}

function runGame() {


    intervalId = setInterval(() => {
        let randomMole = randomHoleSelector();

        if (randomMole !== undefined) {
            moleGetOut(randomMole);
        }

        manageGameAcceleration();

        checkGameEnd();

    }, generationPeriod)

    return intervalId;
}

function startGame() {
    let startDelayInMs = 3000;
    displayModalReady(startDelayInMs); // could add modal setTimeout that is called below as callback

    initGame();
    readygo.play();

    setTimeout(() => {
        startTime = new Date();
        startTimer();
        runGame();
    }, startDelayInMs);

}


function checkGameEnd() {
    const holesLeft = document.querySelectorAll(".moleContainer:not(.active)");

    if ((holesLeft.length === 0)) {
        stopGame();
        return true;
    }
}

function stopGame() {
    const holesLeft = document.querySelectorAll(".moleContainer:not(.active)");
    // music.pause();

    displayEndgameModal(holesLeft);

    //Push mole transition back to position
    setTimeout(moleGetInSlow, 500);

    clearInterval(intervalId);
    clearInterval(timeIntervalId);
    updateInfo();
    gameOn = false;
}

/////////////////////////// Gaming functions

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
    if (mode !== "survival") {
        let divider = generationPeriod / 10000;
        score += Math.floor(1 / (divider ** 2));
    }
}

function updateInfo() {
    updateScore();
    updateMode();
    updateTime();
    updateHighscore();
}

function updateScore() {
    if (mode != "survival") {
        scoreElement.innerHTML = 'Score: ' + score + "pts";
    } else {
        scoreElement.innerHTML = 'Level: ' + level;
    }
}

function updateMode() {
    modeElement.innerHTML = 'Mode: ' + mode;
}

function updateHighscore() {
    if (mode != "survival") {
        highscoreElement.innerHTML = 'Highscore: ' + highscore + "pts";
    } else {
        highscoreElement.innerHTML = 'Highest lvl: ' + highestlvl;
    }
}

function updateTime() {
    playtimeElement.innerHTML = 'Playtime: ' + playtime + "s";
}

function startTimer() {
    timeIntervalId = setInterval(() => {
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

function displayEndgameModal(holesLeft) {
    if (gameOn === true) {
        if (holesLeft.length === 0) {
            if (isHighscore()) {
                win.play();
                displayModalHiscore();
            } else {
                displayModalYouLose();
                gameover.play();
            }
        }
    }
}


function isHighscore() {
    if (score > highscore) {
        saveHighscore();
        return true;
    }
    if (level > highestlvl) {
        saveLevel();
        return true;
    }
}

function saveHighscore() {
    highscore = score;
}

function saveLevel() {
    highestlvl = level;
}

function manageGameAcceleration() {
    if (mode === "classic") {
        if (molesClickCounter >= numberOfClicksBeforeAcceleration) {
            molesClickCounter = 0;
            generationPeriod = generationPeriod / coeff;
            clearInterval(intervalId);
            console.log("generationPeriod in interval function", generationPeriod);
            runGame(generationPeriod);
        }
    } else if (mode === "survival") {
        if (molesClickCounter >= numberOfClicksBeforeLevelUp) {
            molesClickCounter = 0;
            level++;
            lvlsound.play();
            updateInfo();
        }
    }
}

/////////////////////////////////////////////////////////////Modals
//Highscore !
function displayModalHiscore() {
    modal.style.display = "block";
    if (mode !== "survival") {
        modal.querySelector("p").innerText = `Highscore !!!
        Score : ${score} pts
        Playtime : ${playtime}s`;
    } else {
        modal.querySelector("p").innerText = `Highscore !!!
        Level : ${level} 
        Playtime : ${playtime}s`;
    }
}

// YOU LOSE MODAL
function displayModalYouLose() {
    modal.style.display = "block";
    if (mode !== "survival") {
        modal.querySelector("p").innerText = `You lose !
    Score : ${score} pts
    Playtime : ${playtime}s`;
    } else {
        modal.querySelector("p").innerText = `You lose !
    level : ${level} 
    Playtime : ${playtime}s`;
    }

}

function displayModalReady(displayTimeInMs) {
    modal.style.display = "block";


    let timerInSec = displayTimeInMs === undefined ? 5 : displayTimeInMs / 1000;
    modal.querySelector("p").innerText = `Starting in ${timerInSec} s...
    Good luck !!! :P`;
    let id = setInterval(() => {
        timerInSec--;

        modal.querySelector("p").innerText = `Starting in ${timerInSec} s...
        Good luck !!! :P`;
        if (timerInSec < 1) {
            clearInterval(id);
            modal.style.display = "none"
        }
    }, 1000)
}

span.onclick = function () {
    modal.style.display = "none";
}

///////////////////////////////////////////////////Cursor Animation
window.onmousemove = function (e) {
    cursor.style.left = e.clientX - 10 + 'px';
    cursor.style.top = e.clientY - 40 + 'px';
}

window.onclick = function (e) {
    cursor.classList.add("hammer-rotate")
    setTimeout(() => cursor.classList.remove("hammer-rotate"), 200)
}
