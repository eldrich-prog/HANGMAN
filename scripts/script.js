const wordList = [
    { word: "espejo", definition: "Te muestro tal como eres, pero no soy persona ni animal. ¿Qué soy?" },
    { word: "sombra", definition: "Siempre estoy contigo, pero desaparezco en la oscuridad. ¿Qué soy?" },
    { word: "libro", definition: "Tengo muchas hojas, pero no soy planta. Cuento historias, pero no hablo. ¿Qué soy?" },
    { word: "reloj", definition: "Tengo manecillas pero no brazos. Doy la hora sin hablar. ¿Qué soy?" },
    { word: "lapiz", definition: "Escribo sin tener boca y me desgasto al trabajar. ¿Qué soy?" },
    { word: "huevo", definition: "Tengo una cáscara por fuera y sorpresa por dentro. ¿Qué soy?" },
    { word: "estrella", definition: "Brillo en la noche, pero me oculto de día. ¿Qué soy?" },
    { word: "lluvia", definition: "Caigo del cielo, pero no soy ave ni estrella. ¿Qué soy?" },
    { word: "llave", definition: "Abro sin manos y cierro sin fuerza. ¿Qué soy?" },
    { word: "zapato", definition: "Siempre ando por el suelo, pero no me ensucio como tú. ¿Qué soy?" }
];

const hangmanImage = document.querySelector(".hangman-box img");
let puntaje =10;
hangmanImage.setAttribute("aria-hidden", "true");

const keyboardDiv = document.querySelector(".keyboard");
const wordDisplay = document.querySelector(".word-display");
const guessesText = document.querySelector(".guesses-text b");
const puntajeText = document.querySelector(".puntaje-text b");
guessesText.setAttribute("aria-live", "polite");

function actualizarNivel(puntaje) {
    const nivelSpan = document.getElementById("nivel");
    let nivel = "Principiante";

    if (puntaje >= 20) nivel = "Intermedio";
    if (puntaje >= 50) nivel = "Avanzado";
    if (puntaje >= 100) nivel = "Experto";

    nivelSpan.textContent = nivel;
}

const gameModal = document.querySelector(".game-modal");
gameModal.setAttribute("role", "alertdialog");
gameModal.setAttribute("aria-modal", "true");
gameModal.setAttribute("aria-labelledby", "modal-title");
gameModal.setAttribute("aria-describedby", "modal-desc");

const playAgainButton = document.querySelector(".play-again");
playAgainButton.setAttribute("role", "button");
playAgainButton.setAttribute("aria-label", "Play again");

let currentWord = "", correctLetters = [], wrongGuessCount = 0;
const maxWrongGuesses = 6;

const updateScoreDisplay = () => {
    puntajeText.innerText = `${puntaje}`;
};

const resetGame = () => {
    correctLetters = [];
    wrongGuessCount = 0;
    hangmanImage.src = `images/hangman-${wrongGuessCount}.svg`;
    guessesText.innerText = `${wrongGuessCount} / ${maxWrongGuesses}`;
    puntajeText.innerText = `${puntaje}`;
    keyboardDiv.querySelectorAll("button").forEach(button => button.disabled = false);
    wordDisplay.innerHTML = currentWord.split("")
        .map(() => `<li class="letter" aria-label="Hidden letter"> </li>`)
        .join("");
    gameModal.classList.remove("show");
    updateScoreDisplay();
    actualizarNivel(puntaje);
};

const getRandomWord = () => {
    const { word, definition } = wordList[Math.floor(Math.random() * wordList.length)];
    currentWord = word;
    console.log(word, definition);
    document.querySelector(".hint-text b").innerText = definition;
    resetGame();
};

const gameOver = (isVictory) => {
    setTimeout(() => {
        if (isVictory) {
            puntaje += 10;
            updateScoreDisplay();
        }

        const modalText = isVictory ? "GANASTE!" : "PERDISTE!";
        gameModal.querySelector("img").src = `images/${isVictory ? `victory` : `lost`}.gif`;
        gameModal.querySelector("h4").id = "modal-title";
        gameModal.querySelector("h4").innerText = `${isVictory ? `Congratulations` : `Game Over`}`;
        gameModal.querySelector("p").id = "modal-desc";
        gameModal.querySelector("p").innerHTML = `${modalText} <br> The word was: <b>${currentWord.toUpperCase()}</b>`;
        gameModal.classList.add("show");
    }, 300);
};

const initGame = (button, clickedLetter) => {
    button.disabled = true;

    if (currentWord.includes(clickedLetter)) {
        [...currentWord].forEach((letter, index) => {
            if (letter === clickedLetter) {
                correctLetters[index] = letter;
                const listItems = wordDisplay.querySelectorAll("li");
                listItems[index].innerText = letter;
                listItems[index].classList.add("guessed");
                listItems[index].setAttribute("aria-label", `Letter ${letter}`);
            }
        });
    } else {
        wrongGuessCount++;
        hangmanImage.src = `images/hangman-${wrongGuessCount}.svg`;
    }

    guessesText.innerText = `${wrongGuessCount} / ${maxWrongGuesses}`;
    if (wrongGuessCount === maxWrongGuesses) return gameOver(false);
    if (!wordDisplay.querySelector("li:not(.guessed)")) return gameOver(true);
};

// Crear botones del teclado
for (let i = 97; i <= 122; i++) {
    const letter = String.fromCharCode(i);
    const button = document.createElement("button");
    button.innerText = letter;
    button.setAttribute("role", "button");
    button.setAttribute("aria-label", `Letter ${letter}`);
    keyboardDiv.appendChild(button);
    button.addEventListener("click", e => initGame(e.target, letter));
}

getRandomWord();
playAgainButton.addEventListener("click", getRandomWord);
