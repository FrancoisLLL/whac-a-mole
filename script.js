//Const and global var 
const grid = document.getElementById("grid");
const moles = document.querySelectorAll(".moleContainer");
const scoreElement = document.getElementById("score");
const speedElement = document.getElementById("speed");
const playtimeElement = document.getElementById("playtime");
const levelElement = document.getElementById("level");
const numberOfClicksBeforeLevelUp = 10;
let startTime = new Date();

let generationPeriod = 1000;
const coeff = 1.10;
let counter = 0;
let score = 0;
let level = 1;
let gameOn = true;


// Audio
const music = document.getElementById("background-music");
const hit = document.getElementById("hit");
const miss = document.getElementById("miss");

music.volume = 0.1;
hit.volume = 0.1;
miss.volume = 0.1;

//modal you lose
var modal = document.getElementById("myModal");
var span = document.getElementsByClassName("close")[0];

///////////////////////////////////////////////////////////////////////////////////////////////////

//Add event listeners on HTML moles element
moles.forEach((item) => item.addEventListener('click', killMole));

function killMole(event) {
    let mole = event.currentTarget;

    if (gameOn === true && mole.classList.contains("active")) {
        increaseScore(mole);
        mole.classList.remove("active");
        mole.classList.add("getIn");
        mole.classList.remove("getOut");
        updateScore ();
        updateLevel () ;
        hit.play();
        counter++;
    }
    miss.play();
}

function increaseScore (mole) {
    if(mole.classList.contains("active")) {
        score += Math.floor(10000000 / (generationPeriod * generationPeriod));
    }
    return score;
}

function updateScore () {
    scoreElement.innerHTML = 'Score : ' + score + " points";
}

function updateLevel () {
    levelElement.innerHTML = 'Level : ' + level;
}

function updateSpeed () {
    speedElement.innerHTML = 'Speed : ' + Math.floor(1000000/ (generationPeriod));
}

function updateTime () {
    playtimeElement.innerHTML = 'Playtime : ' + Math.floor( (new Date() - startTime) /1000) + "sec";
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

    let intervalId = setInterval(() => {
         updateTime () ;
        let randomMole = randomHoleSelector();
        
        if(checkGameOver()) {
            clearInterval(intervalId);
        };

        if (randomMole !== undefined ){
            randomMole.classList.add("active");
            randomMole.classList.add("getOut");
            randomMole.classList.remove("getIn");
        }

        if (counter > numberOfClicksBeforeLevelUp) {
            counter = 0;
            level++;
            generationPeriod = 10 * (Math.floor(generationPeriod / coeff / 10 )) ;
            clearInterval(intervalId);
            console.log("generationPeriod in interval function", generationPeriod);
            startGame(generationPeriod);
        }       
    }, generationPeriod)
}

function checkGameOver() {
    const holesLeft = document.querySelectorAll(".moleContainer:not(.active)");
    if (holesLeft.length <2) {
        gameOn = false;
        music.pause();
        
        displayModalYouLose();

        return true;
    }
}

startGame();

function displayModalYouLose() {
    modal.style.display = "block";
    modal.querySelector("p").innerText = `You lost !
    Score : ${score} points
    Playtime : ${Math.floor( (new Date() - startTime) /1000 )}s
    Level : ${level}`;
}

// When the user clicks on <span> (x), close the modal
span.onclick = function() {
  modal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}