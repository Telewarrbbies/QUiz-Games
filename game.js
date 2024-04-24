// DOM elements
const elements = {
    question: document.getElementById('question'),
    choices: Array.from(document.getElementsByClassName('choice-text')),
    progressText: document.getElementById('progressText'),
    scoreText: document.getElementById('score'), 
    progressBarFull: document.getElementById('progressBarFull'),
    loader: document.getElementById('loader'),
    game: document.getElementById('game')
};

// Game state
let gameState = {
    currentQuestion: {},
    acceptingAnswers: false,
    score: 0,
    questionCounter: 0,
    availableQuestions: []
};

// Fetch trivia questions from the Open Trivia Database API
fetch("https://opentdb.com/api.php?amount=50&type=multiple")
  .then(response => {
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json();
  })
  .then(data => {
    // Process the retrieved trivia questions
    gameState.availableQuestions = data.results.map(result => {
      const formattedQuestion = {
        question: result.question,
        correctAnswer: result.correct_answer,
        incorrectAnswers: result.incorrect_answers
      };
      return formattedQuestion;
    });
    // Start the game after loading questions
    initializeGame();
  })
  .catch(error => {
    console.error('Error fetching trivia questions:', error);
  });

// Initialize the game
function initializeGame() {
    gameState.questionCounter = 0;
    gameState.score = 0;
    showGame(); // Show game elements
    startNewQuestion(); // Start the first question
}

// Start a new question
function startNewQuestion() {
    if (gameState.questionCounter >= MAX_QUESTIONS) {
        // End the game if the maximum number of questions is reached
        localStorage.setItem('mostRecentscore', gameState.score);
        window.location.assign('/end.html');
        return;
    }

    gameState.questionCounter++;
    elements.progressText.innerText = `Question ${gameState.questionCounter}/${MAX_QUESTIONS}`;
    elements.progressBarFull.style.width = `${(gameState.questionCounter / MAX_QUESTIONS) * 100}%`;

    // Pick a random question from availableQuestions
    const questionIndex = Math.floor(Math.random() * gameState.availableQuestions.length);
    gameState.currentQuestion = gameState.availableQuestions[questionIndex];
    elements.question.innerText = gameState.currentQuestion.question;

    // Display answer choices
    gameState.currentQuestion.incorrectAnswers.forEach((choice, index) => {
        elements.choices[index].innerText = choice;
    });
    // Add correct answer to choices randomly
    const correctIndex = Math.floor(Math.random() * elements.choices.length);
    elements.choices[correctIndex].innerText = gameState.currentQuestion.correctAnswer;

    gameState.acceptingAnswers = true;
}

// Handle click on a choice
function handleChoiceClick(e) {
    if (!gameState.acceptingAnswers) return;

    gameState.acceptingAnswers = false;
    const selectedChoice = e.target;
    const selectedAnswer = selectedChoice.innerText;

    const classToApply = selectedAnswer === gameState.currentQuestion.correctAnswer ? "correct" : "incorrect";
    if (classToApply === "correct") {
        incrementScore(CORRECT_BONUS);
    }
    selectedChoice.parentElement.classList.add(classToApply);

    setTimeout(() => {
        selectedChoice.parentElement.classList.remove(classToApply);
        startNewQuestion();
    }, 1000);
}

// Increment score
function incrementScore(num) {
    gameState.score += num;
    elements.scoreText.innerText = gameState.score;
}

// Show the game elements
function showGame() {
    elements.game.classList.remove('hidden');
    elements.loader.classList.add('hidden');
}

// Constants
const CORRECT_BONUS = 10;
const MAX_QUESTIONS = 5;

// Event listeners
elements.choices.forEach(choice => {
    choice.addEventListener("click", handleChoiceClick);
});
