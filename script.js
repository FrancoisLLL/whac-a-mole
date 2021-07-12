const grid = document.getElementById("grid");
// const holes = document.querySelectorAll(".hole");
const moles = document.querySelectorAll(".moleContainer");

let delay = 1000;
const coeff = 1.1;
let counter = 0;
let score = 0;
let gameOn = true;

moles.forEach((item) => item.addEventListener('click', killMole));

function killMole(event) {
    let mole = event.currentTarget;
    if (gameOn ===true) {
        increaseScore(mole);
        mole.classList.remove("active");
        mole.classList.add("getIn");
        mole.classList.remove("getOut");
    }
    
    counter++;
}

function increaseScore (mole) {
    if(mole.classList.contains("active")) {
        score = score + 10;
    }
    console.log(score);
    return score;
}

function randomHoleSelector() {
    const molesLeft = document.querySelectorAll(".moleContainer:not(.active)");
    if (molesLeft.length === 0) {
        return undefined;
    } else {
        return molesLeft[Math.floor(Math.random() * molesLeft.length)];
    }
}

function displayMole(delay) {

    let intervalId = setInterval(() => {
        let randomMole = randomHoleSelector();
        if(checkGameOver()) {
            clearInterval(intervalId);
        };
        if (randomMole === undefined) {

        } else {
            // randomMole.children.classList.add("active")
            randomMole.classList.add("active");
            randomMole.classList.add("getOut");
            randomMole.classList.remove("getIn");
            
        }

        if (counter > 10) {
            counter = 0;
            delay = delay / coeff;
            clearInterval(intervalId);
            displayMole(delay);
        }

    }, delay)
}

function checkGameOver() {
    const holesLeft = document.querySelectorAll(".moleContainer:not(.active)");
    if (holesLeft.length === 0) {
        console.log("perdu");
         gameOn = false;

        return true;
    }
}

displayMole(delay);