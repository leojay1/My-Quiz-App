// 🎯 Get references to DOM elements
const questionText = document.getElementById('question-text');
const answerOptions = document.getElementById('answer-options');
const questionCounter = document.getElementById('question-counter');
const scoreDisplay = document.getElementById('score-display');
const tryAgainButton = document.getElementById('try-again');
const navigation = document.getElementById('navigation');
const loader = document.getElementById('loader'); // Optional loader element
const quizWrapper = document.querySelector('.quiz-wrapper'); // For error display

// 🧠 Quiz state variables
let questions = [];
let currentQuestionIndex = 0;
let score = 0;

// 📡 Fetch questions from Open Trivia DB API
async function fetchQuestions() {
  try {
    navigation.style.display = 'none'; // Hide navigation initially
    loader.textContent = 'Loading questions...'; // Show loading message

    const res = await fetch('https://opentdb.com/api.php?amount=15&category=32&difficulty=medium&type=multiple');
    const data = await res.json();

    if (!data.results || data.results.length === 0) {
      throw new Error('No questions found. Please try again later.');
    }

    questions = data.results;
    loader.textContent = ''; // Clear loader
    showQuestions(); // ✅ Start the quiz
    navigation.style.display = 'flex'; // Show navigation
  } catch (err) {
    console.error('Error fetching questions:', err);
    loader.textContent = ''; // Clear loader
    displayError('⚠️ Unable to load quiz questions. Please check your internet connection or try again later.');
  }
}

// ❌ Display error message in the DOM
function displayError(message) {
  const errorDiv = document.createElement('div');
  errorDiv.textContent = message;
  errorDiv.style.color = '#ff4d4d';
  errorDiv.style.fontWeight = 'bold';
  errorDiv.style.textAlign = 'center';
  errorDiv.style.marginTop = '20px';
  quizWrapper.appendChild(errorDiv);
}

// 📋 Display the current question and answer options
function showQuestions() {
  const question = questions[currentQuestionIndex];
  questionText.innerHTML = question.question;
  questionText.classList.remove('quiz-completed'); // Remove completed style
  answerOptions.innerHTML = '';

  // 🧪 Combine correct and incorrect answers, then shuffle
  const answers = [...question.incorrect_answers, question.correct_answer];
  shuffleArray(answers);

  // 🧱 Create a button for each answer
  answers.forEach(answer => {
    const button = document.createElement('button');
    button.textContent = answer;
    button.classList.add('answer-btn');
    button.onclick = () => selectAnswer(answer, question.correct_answer);
    answerOptions.appendChild(button);
  });

  // 📊 Update question counter and score display
  questionCounter.textContent = `Question ${currentQuestionIndex + 1} of ${questions.length}`;
  scoreDisplay.textContent = `Score: ${Math.round((score / questions.length) * 100)} / 100`;

  // ⏮️⏭️ Update navigation buttons
  navigation.innerHTML = '';

  if (currentQuestionIndex > 0) {
    const prevBtn = document.createElement('button');
    prevBtn.textContent = 'Previous';
    prevBtn.onclick = prevQuestion;
    navigation.appendChild(prevBtn);
  }

  const nextBtn = document.createElement('button');
  nextBtn.textContent = 'Next';
  nextBtn.onclick = nextQuestion;
  navigation.appendChild(nextBtn);
}

// 🔀 Shuffle array using Fisher-Yates-like method
function shuffleArray(array) {
  array.sort(() => Math.random() - 0.5);
}

// ✅ Handle answer selection
function selectAnswer(selected, correct) {
  if (selected === correct) {
    score += 1;
  }
  nextQuestion(); // Move to next question after selection
}

// ⏭️ Go to the next question
function nextQuestion() {
  currentQuestionIndex++;
  if (currentQuestionIndex < questions.length) {
    showQuestions();
  } else {
    endQuiz(); // End quiz if no more questions
  }
}

// ⏮️ Go to the previous question
function prevQuestion() {
  if (currentQuestionIndex > 0) {
    currentQuestionIndex--;
    showQuestions();
  }
}

// 🏁 End the quiz and show final score
function endQuiz() {
  questionText.textContent = "🎉 Quiz Completed!";
  questionText.classList.add('quiz-completed'); // Add completed style
  answerOptions.innerHTML = '';
  questionCounter.textContent = '';
  scoreDisplay.textContent = `Final Score: ${Math.round((score / questions.length) * 100)} / 100`;
  tryAgainButton.style.display = 'block';
  navigation.innerHTML = '';
}

// 🔄 Refresh the page on Try Again
tryAgainButton.addEventListener("click", function () {
  location.reload(); // Full browser refresh
});

// 🚀 Start the quiz app
fetchQuestions();