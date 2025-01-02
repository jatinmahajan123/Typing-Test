const sentences = [
    "After all, you're only an immortal until someone manages to kill you.",
    "As long as poverty, injustice, and gross inequality persist in our world, none of us can truly rest.",
    "For once you have tasted flight you will walk the earth with your eyes turned skywards.",
    "Life is beautiful, as long as it consumes you. When it is rushing through you, life is gorgeous.",
    "We were like deaf people trying to dance to a beat we couldn't hear, long after the music actually stopped.",
];

const sentenceDisplay = document.getElementById("sentence-display");
const typingBox = document.getElementById("typing-box");
const startButton = document.getElementById("start-button");
const doneButton = document.getElementById("done-button");
const resetButton = document.getElementById("reset-button");
const wpmDisplay = document.getElementById("wpm");
const accuracyDisplay = document.getElementById("accuracy");
const timeElapsedDisplay = document.getElementById("time-elapsed");
const timerModeButton = document.getElementById("timer-mode-btn");

let startTime, endTime;
let timerInterval;
let currentIndex = 0;
let timerMode = false; // False for regular mode, True for 30-second mode

// Start timer for both modes
const startTimer = (timeLimit = 60) => {
    if (timerMode) {
        // For 30-second countdown timer
        let timeRemaining = timeLimit;
        timeElapsedDisplay.innerText = `${timeRemaining}s`;
        timerInterval = setInterval(() => {
            timeRemaining--;
            timeElapsedDisplay.innerText = `${timeRemaining}s`;
            if (timeRemaining === 0) {
                stopTimer();
                endGame(); // Automatically end the game after time is up
            }
        }, 1000);
    } else {
        // For counting up the time in regular mode
        startTime = new Date().getTime();
        timeElapsedDisplay.innerText = `0s`;
        timerInterval = setInterval(() => {
            let elapsedTime = Math.floor((new Date().getTime() - startTime) / 1000);
            timeElapsedDisplay.innerText = `${elapsedTime}s`;
        }, 1000);
    }
};

const stopTimer = () => {
    clearInterval(timerInterval);
};

const playGame = () => {
    // Choose a random sentence to type
    const randomIndex = Math.floor(Math.random() * sentences.length);
    const sentence = sentences[randomIndex];
    sentenceDisplay.innerText = sentence;  // Display the sentence
    typingBox.value = "";
    typingBox.disabled = false;
    typingBox.focus();
    currentIndex = 0;
    startButton.classList.add("hidden");
    doneButton.classList.remove("hidden");
    resetButton.classList.remove("hidden");
    wpmDisplay.innerText = "0";
    accuracyDisplay.innerText = "0%";

    // Use 30 seconds mode or no time limit based on the setting
    if (timerMode) {
        startTimer(30); // Start the 30-second countdown timer if timerMode is enabled
    } else {
        // No time limit, just wait until the sentence is complete
        timeElapsedDisplay.innerText = "0s";
        startTimer(); // Start counting up the time
    }
};

const endGame = () => {
    stopTimer();
    endTime = new Date().getTime();
    const typedText = typingBox.value.trim();
    const wordCount = typedText.split(/\s+/).length;

    let speed;
    if (timerMode) {
        // 30-second mode: Calculate WPM using 30 seconds
        speed = Math.round((wordCount / 30) * 60);
    } else {
        // Regular mode: Calculate WPM using actual time elapsed
        const totalTime = (endTime - startTime) / 1000; // Time in seconds
        speed = Math.round((wordCount / totalTime) * 60);
    }

    const accuracy = calculateAccuracy(sentenceDisplay.innerText, typedText);

    wpmDisplay.innerText = speed;
    accuracyDisplay.innerText = `${accuracy}%`;
    typingBox.disabled = true;
    doneButton.classList.add("hidden");
};

const calculateAccuracy = (original, typed) => {
    const originalWords = original.split(" ");
    const typedWords = typed.split(" ");
    let correctWords = 0;

    originalWords.forEach((word, i) => {
        if (word === typedWords[i]) correctWords++;
    });

    return Math.round((correctWords / originalWords.length) * 100);
};

typingBox.addEventListener("input", () => {
    const sentence = sentences[sentences.indexOf(sentenceDisplay.innerText)];
    const typedText = typingBox.value;

    // Check character match
    if (typedText[currentIndex] === sentence[currentIndex]) {
        currentIndex++;
        // Automatically end game if sentence is complete
        if (currentIndex === sentence.length) {
            endGame();
        }
    }
});

startButton.addEventListener("click", playGame);
doneButton.addEventListener("click", endGame);
resetButton.addEventListener("click", () => {
    stopTimer();
    playGame();
});

// Toggle for 30-second mode
timerModeButton.addEventListener("click", () => {
    timerMode = !timerMode;
    document.getElementById("timer-mode-btn").innerText = timerMode ? "⚡ 30 Second Mode: ON" : "⚡ 30 Second Mode: OFF";

    // Add or remove fire effect class when 30-second mode is on or off
    if (timerMode) {
        timerModeButton.classList.add("fire-on");
    } else {
        timerModeButton.classList.remove("fire-on");
    }
});
