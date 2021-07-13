//Const and global var 

const grid = document.getElementById("grid");
const moles = document.querySelectorAll(".moleContainer");
//Infos
const scoreElement = document.getElementById("score");
const modeElement = document.getElementById("mode");
const highscoreElement = document.getElementById("highscore");
const playtimeElement = document.getElementById("playtime");

const sectionMain = document.getElementById("main");
const sectionHome = document.getElementById("home");

//Buttons
const restartButton = document.getElementById("restart");
const easyButton = document.getElementById("easy");
const classicButton = document.getElementById("classic");
const hardcoreButton = document.getElementById("hardcore");
const backButton = document.getElementById("back");

//Modal
const modal = document.getElementById("modal");
const span = document.getElementsByClassName("close")[0];

//Francois : better to create Object ?
let numberOfClicksBeforeLevelUp = 10;
let winningScore = 5000;
let startTime = new Date();
let playtime = 0;
let generationPeriod = 1000;
let coeff = 1.10;
let counter = 0;
let score = 0;
let level = 1;
let gameOn = true;
let highscore = 2000;
let mode = "Easy";

let intervalId = 0;


// Audio
const music = document.getElementById("background-music");
const hit = document.getElementById("hit");
const miss = document.getElementById("miss");

music.volume = 0.1;
hit.volume = 0.1;
miss.volume = 0.1;

///////////////////////////////////////////////////////////////////////////////////////////////////

//Add event listeners 
moles.forEach((item) => item.addEventListener('click', killMole));

restartButton.onclick = function () {
    initGame();
    startGame();
};

backButton.onclick = function () {
    sectionHome.classList.remove("hidden");
    sectionMain.classList.add("hidden");
    initGame();
};

easyButton.onclick = function () {
    sectionHome.classList.add("hidden");
    sectionMain.classList.remove("hidden");
    initGame();
    startGame();

    winningScore = 1000;
    mode= "easy";
    updateMode();
    updateHighscore();
};

classicButton.onclick = function () {
    sectionHome.classList.add("hidden");
    sectionMain.classList.remove("hidden");
    initGame();
    startGame();

    coeff = 1.15;
    winningScore = 5000;
    mode="classic";
    updateMode();
    updateHighscore();
};

hardcoreButton.onclick = function () {
    sectionHome.classList.add("hidden");
    sectionMain.classList.remove("hidden");
    initGame();
    startGame();
    coeff = 1.2;
    winningScore = 9999999999999;
    mode="hardcore";
    updateMode();
};



//Add event listener on button

function killMole(event) {
    let mole = event.currentTarget;

    if (gameOn === true && mole.classList.contains("active")) {
        increaseScore(mole);
        mole.classList.remove("active");
        mole.classList.add("getIn");
        mole.classList.remove("getOut");
        updateScore();
        // updateLevel();
        hit.play();
        counter++;
    }
    if (checkGameStatus()) {
        clearInterval(intervalId);
    };
    miss.play();
}

function increaseScore(mole) {
    if (mole.classList.contains("active")) {
        score += Math.floor(10000000 / (generationPeriod * generationPeriod));
    }
    return score;
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
    playtime = Math.floor((new Date() - startTime) / 1000);

    playtimeElement.innerHTML = 'Playtime: ' + playtime  + "s";
    //Math.floor((new Date() - startTime) / 1000)
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

    intervalId = setInterval(() => {
        updateTime();
        playtime = Math.floor((new Date() - startTime) / 1000);
        let randomMole = randomHoleSelector();

        if (checkGameStatus()) {
            clearInterval(intervalId);
        };

        if (randomMole !== undefined) {
            randomMole.classList.add("active");
            randomMole.classList.add("getOut");
            randomMole.classList.remove("getIn");
        }

        if (counter > numberOfClicksBeforeLevelUp) {
            counter = 0;
            level++;
            generationPeriod = 10 * (Math.floor(generationPeriod / coeff / 10));
            clearInterval(intervalId);
            console.log("generationPeriod in interval function", generationPeriod);
            startGame(generationPeriod);
        }
    }, generationPeriod)

    return intervalId;
}

function checkGameStatus() {
    const holesLeft = document.querySelectorAll(".moleContainer:not(.active)");
    updateHighscore();

    if (holesLeft.length < 2) {
        gameOn = false;
        music.pause();
        clearInterval(intervalId);
        if (isHighscore()) {
            setTimeout(displayModalHiscore, 1000)
        } else {
            setTimeout(displayModalYouLose, 1000)
        }
        return true;

    } else if (score > winningScore) {
        gameOn = false;
        music.pause();
        isHighscore(score);
        setTimeout(displayModalYouWin, 1000)
        clearInterval(intervalId);
        return true;
    }
}

function initGame() {
    startTime = new Date();
    generationPeriod = 1000;
    counter = 0;
    score = 0;
    level = 1;
    gameOn = true;
    clearInterval(intervalId);

    moles.forEach((child) => child.classList.remove("active"));
    moles.forEach((child) => child.classList.add("getIn"));
    moles.forEach((child) => child.classList.remove("getOut"));

    updateScore();
    // updateLevel();
    updateTime();

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
window.onclick = function (event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}