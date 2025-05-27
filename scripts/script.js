const wordList = [
    { word: "apple", definition: "A fruit" },
    { word: "code", definition: "A set of instructions" },
    { word: "sun", definition: "The star at the center of the solar system" }
];

const hangmanImage = document.querySelector(".hangman-box img");
hangmanImage.setAttribute("aria-hidden", "true"); // Imagen decorativa

const keyboardDiv = document.querySelector(".keyboard");
const wordDisplay = document.querySelector(".word-display");
const guessesText = document.querySelector(".guesses-text b");
guessesText.setAttribute("aria-live", "polite"); // Anunciar cambios de intentos

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

const resetGame = () => {
    correctLetters = [];
    wrongGuessCount = 0;
    hangmanImage.src = `images/hangman-${wrongGuessCount}.svg`;
    guessesText.innerText = `${wrongGuessCount} / ${maxWrongGuesses}`;
    keyboardDiv.querySelectorAll("button").forEach(button => button.disabled = false);
    wordDisplay.innerHTML = currentWord.split("")
        .map(() => `<li class="letter" aria-label="Hidden letter">  </li>`)
        .join("");
    gameModal.classList.remove("show");
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
        const modalText = isVictory ? "You won!" : "You lost!";
        gameModal.querySelector("img").src = `images/${isVictory ? `Victory` : `Lost`}.gif`;
        gameModal.querySelector("h4").id = "modal-title";
        gameModal.querySelector("h4").innerText = `${isVictory ? `Congratulations` : `Game Over`}`;
        gameModal.querySelector("p").id = "modal-desc";
        gameModal.querySelector("p").innerHTML = `${modalText} <br> The word was: <b>${currentWord.toUpperCase()}</b>`;
        gameModal.classList.add("show");
    }, 300);
};

const initGame = (button, clickedLetter) => {
    if (currentWord.includes(clickedLetter)) {
        [...currentWord].forEach((letter, index) => {
            if (letter === clickedLetter) {
                correctLetters.push(letter);
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

    button.disabled = true;
    guessesText.innerText = `${wrongGuessCount} / ${maxWrongGuesses}`;

    if (wrongGuessCount === maxWrongGuesses) return gameOver(false);
    if (correctLetters.length === currentWord.length) return gameOver(true);
};

// Crear botones del teclado con accesibilidad
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
