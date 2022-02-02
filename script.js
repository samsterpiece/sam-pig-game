'use strict';

//loading dice images
let images = ["assets/dice-01.svg",
    "assets/dice-02.svg",
    "assets/dice-03.svg",
    "assets/dice-04.svg",
    "assets/dice-05.svg",
    "assets/dice-06.svg"
];


//Selecting elements 

const player1El = document.querySelector('.left');
const player2El = document.querySelector('.right');
const score1El = document.getElementById("score--0");
const score2El = document.getElementById("score--1");
const lifetimeScore1 = document.querySelector(".life--0");
const lifetimeScore2 = document.querySelector(".life--1");
const current1Element = document.getElementById("current--0");
const current2Element = document.getElementById("current--1");

const snakeEye = document.querySelector(".snakeText")
const diceEl = document.querySelector(".dice-wrapper");
const btnNew = document.querySelector(".new");
const btnHold = document.querySelector(".hold");
const btnRoll = document.querySelector(".roll");
const winMessage = document.querySelector(".winnerText");

let scores, currentScore, activePlayer, playing;
//Selects all the dice images
let dice = document.querySelectorAll("img");



// Helper function for localStorage
const getLifetimeScore = function (player) {
    return Number(localStorage.getItem(`lifetime-score-${player}`)) ? ? 0;
}

// Helper function that sets new lifetime score in local storage, and updates dom
const setLifetimeScore = function (player, currentScore, currentLifetimeScore) {
    localStorage.setItem(`lifetime-score-${player}`, currentLifetimeScore + currentScore)
    document.querySelector(`.life--${player}`).textContent = currentLifetimeScore + currentScore
}

//Initializing conditions for game
const init = function () {

    snakeEye.classList.add('hidden');
    winMessage.classList.add('hidden');

    scores = [0, 0];
    currentScore = 0;
    activePlayer = 0; //Starting player is at 0. Second player is at 1
    playing = true;

    score1El.textContent = 0;
    score2El.textContent = 0;
    current1Element.textContent = 0;
    current2Element.textContent = 0;

    player1El.classList.remove('player--winner');
    player2El.classList.remove('player--winner');
    player1El.classList.add('player--active');
    player2El.classList.remove('player--active');

    lifetimeScore1.textContent = "Lifetime Score P1: " + getLifetimeScore(0)
    lifetimeScore2.textContent = "Lifetime Score P2: " + getLifetimeScore(1)
};

init();



//Function that allows the switching of players
const switchPlayer = function () {
    document.getElementById(`current--${activePlayer}`).textContent = 0;
    activePlayer = activePlayer === 0 ? 1 : 0;
    currentScore = 0;
    player1El.classList.toggle('player--active');
    player2El.classList.toggle('player--active');
}


//Roll function
//Handles case where if Dice is 1, move on to the next player,
//Otherwise, continue roll and add to current score, and lifetime score, until one hits 0.
//if both die's are one, player scores nothing, total score goes to 0, turn ends
btnRoll.addEventListener('click', function roll() {

    if (playing) {

        //Adding effect to dice shake
        dice.forEach(function (die) {
            die.classList.add("shake");
        });

        //Dice shakes for some time before stopping
        setTimeout(function () {
                dice.forEach(function (die) {
                    die.classList.remove("shake");
                });

                //Generate Dice Variables 1 to 6, can expand to more than 6-sided if desired(+1 = 6, +2 = 7, +3 = 8, +4 = 9...)
                const dieOneValue = Math.floor(Math.random() * 6) + 1;
                const dieTwoValue = Math.floor(Math.random() * 6) + 1;


                //Changes the look of the dice number
                document.querySelector("#die-1").setAttribute("src", images[dieOneValue - 1]);
                document.querySelector("#die-2").setAttribute("src", images[dieTwoValue - 1]);


                console.log("Die one:", dieOneValue, "Die two: ", dieTwoValue);

                //Case 1: Snake Eyes, no score, total reset, turn ends
                if (dieOneValue === 1 && dieTwoValue === 1) {
                    snakeEye.classList.remove('hidden'); //Notification of snake eyes
                    currentScore = 0;
                    scores[activePlayer] = currentScore; //sets current score and total to 0.
                    btnHold.disabled = false;
                    document.getElementById(`score--${activePlayer}`).textContent = scores[activePlayer]; //Adds to page of update
                    switchPlayer(); //changes player

                    //Case 2: One of the dies is one, go to next player
                } else if (dieOneValue === 1 || dieTwoValue === 1) {
                    btnHold.disabled = false;
                    switchPlayer();
                } else if (dieOneValue === dieTwoValue) { //Case 3: Matching dies
                    btnHold.disabled = true; //Prevents player for holding, must roll again
                    snakeEye.classList.add('hidden');
                    currentScore += (dieOneValue + dieTwoValue); //adds the sum of doubles to current score
                    document.getElementById(`current--${activePlayer}`).textContent = currentScore; //doubles sum reflected in current score
                } else { //Default case
                    btnHold.disabled = false;
                    snakeEye.classList.add('hidden');
                    currentScore += (dieOneValue + dieTwoValue);
                    document.getElementById(`current--${activePlayer}`).textContent = currentScore;
                }


            }, //end of shake
            1000
        );
    } //end of if playing function

    //end of button roll function
});


btnHold.addEventListener('click', function () {

    if (playing) {

        // 1. Add current score to active player's score
        scores[activePlayer] += currentScore;

        document.getElementById(`score--${activePlayer}`).textContent =
            scores[activePlayer];

        // 2. Check if player's score is >= 100
        if (scores[activePlayer] >= 100) {

            winMessage.classList.remove('hidden');

            // Finish the game
            playing = false;
            document.querySelector(`.player--${activePlayer}`).classList.add('player--winner');
            document.querySelector(`.player--${activePlayer}`).classList.remove('player--active');
            const currentLifetimeScore = getLifetimeScore(activePlayer)
            setLifetimeScore(activePlayer, scores[activePlayer], currentLifetimeScore)
        } else {
            // Switch to the next player
            switchPlayer();
        }
    }
}); //end of hold

btnNew.addEventListener('click', init);