const grid = document.getElementById("grid");
const holes = document.querySelectorAll(".hole");
let delay = 1000;
const coeff = 1.1;
let counter = 0;

holes.forEach((item) => item.addEventListener('click', doSomething));

function doSomething(event) {
    let hole = event.currentTarget;
    hole.classList.remove("mole");
    counter++;
}

function randomHoleSelector() {
    const holesLeft = document.querySelectorAll(".hole:not(.mole)");
    if (holesLeft.length === 0) {
        return undefined;
    } else {
        return holesLeft[Math.floor(Math.random() * holesLeft.length)];
    }
}

function displayMole(delay) {

    let intervalId = setInterval(() => {
        if(checkGameOver()) {
            clearInterval(intervalId);
        };
        if (randomHoleSelector() === undefined) {

        } else {
            randomHoleSelector().classList.add("mole");
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
    const holesLeft = document.querySelectorAll(".hole:not(.mole)");
    if (holesLeft.length === 0) {
        console.log("perdu");
        return true;
    }
}

displayMole(delay);