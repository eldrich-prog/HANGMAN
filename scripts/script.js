const wordList = [
    { word: "sqlserver", definition: "¿Cómo se llama el sistema de gestión de bases de datos de Microsoft?" },
    { word: "tsql", definition: "¿Qué lenguaje propietario usa SQL Server para realizar consultas y procedimientos?" },
    { word: "select", definition: "¿Qué instrucción se utiliza para consultar datos en SQL Server?" },
    { word: "insert", definition: "¿Qué comando se usa para agregar nuevos registros a una tabla?" },
    { word: "update", definition: "¿Qué comando modifica los valores existentes en una tabla?" },
    { word: "delete", definition: "¿Qué comando elimina registros de una tabla?" },
    { word: "drop", definition: "¿Qué instrucción elimina una tabla por completo, incluyendo su estructura?" },
    { word: "primarykey", definition: "¿Cómo se llama la clave que identifica de forma única cada fila en una tabla?" },
    { word: "foreignkey", definition: "¿Qué tipo de clave se usa para relacionar datos entre dos tablas?" },
    { word: "join", definition: "¿Qué palabra clave permite combinar registros de dos o más tablas relacionadas?" },
    { word: "where", definition: "¿Qué cláusula se utiliza para establecer condiciones en una consulta?" },
    { word: "groupby", definition: "¿Qué cláusula permite agrupar registros que tienen los mismos valores en columnas específicas?" },
    { word: "having", definition: "¿Qué cláusula filtra resultados después de agruparlos con GROUP BY?" },
    { word: "count", definition: "¿Qué función devuelve el número de registros en una consulta?" },
    { word: "null", definition: "¿Qué valor representa datos desconocidos o inexistentes en SQL Server?" },
    { word: "index", definition: "¿Qué objeto se usa para mejorar el rendimiento de las búsquedas en una tabla?" },
    { word: "view", definition: "¿Qué objeto es una consulta guardada que actúa como una tabla virtual?" },
    { word: "procedure", definition: "¿Qué objeto almacena un conjunto de instrucciones SQL para su reutilización?" },
    { word: "trigger", definition: "¿Qué objeto se ejecuta automáticamente en respuesta a eventos como INSERT o UPDATE?" },
    { word: "backup", definition: "¿Qué operación permite crear una copia de seguridad de la base de datos?" }
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
