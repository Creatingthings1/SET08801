const buttonSound = document.getElementById("buttonSound"); /* declaring button sound, referencing it to html button sound element using its ID*/
let currentQuestionIndex = 0; /* this variable is tracking which question user is on, IN ARRAYS FIRST ELEMENT IS refrenced as 0 not 1 */
let selectedAnswer = null; /*this variable is storing what the user has selected for the current question being displayed, null means no answer has been selected yet.*/
let userAnswers = []; /* in this empty array all of the answers the user chooses will be stored*/

const questionText = document.getElementById("questionText"); /* in this array all of the answers the user chooses are stored*/
const answerButtons = document.getElementById("answerButtons"); /*Gets the HTML element where the question text will be displayed*/
const nextBtn = document.getElementById("nextBtn"); /*Gets the Next button*/
const backBtn = document.getElementById("backBtn"); /*Gets the back button*/
const progressText = document.getElementById("progressText"); /*Gets the text that will show progress e.g. Question 3 of 20 */
const progressFill = document.getElementById("progressFill"); /*Gets the progress bar fill element*/

function playButtonSound() { /*declaring a function  */
  if (buttonSound) { /*Checks that the audio element exists before trying to play it.*/
    buttonSound.currentTime = 0; /* .currentime resets the audio everytime, it can help with stopping audio from playing on a loop from inital first click, or not playiing at all after first click*/
    buttonSound.play(); /*Plays the audio */
  }
}

function showQuestion() { /*declaring the function which displays the question*/
  const currentQuestion = quiz[currentQuestionIndex];  /*Gets the current question from the quiz array, refer to QUESTIONLOGIC.JS*/

  selectedAnswer = userAnswers[currentQuestionIndex] || null; /*Checks whether the user already answered this question. If yes, it loads that previous answer. If not, it sets selectedAnswer to null */

  questionText.textContent = currentQuestion.question; /*Displays the current question text on the page*/
  answerButtons.innerHTML = ""; /*Clears old answer buttons before adding new ones */

  progressText.textContent = `Question ${currentQuestionIndex + 1} of ${quiz.length}`; /*Updates the progress text. currentQuestionIndex + 1 is used because users expect counting to start at 1, not 0. ARRAY ELEMENTS START 1 AS 0 */

  const progressPercent = ((currentQuestionIndex + 1) / quiz.length) * 100; /*Calculates how much of the quiz has been completed as a percentage*/
  progressFill.style.width = `${progressPercent}%`; /*Updates the progress bar width visually*/

  nextBtn.disabled = selectedAnswer === null; /*Disables the Next button if no answer has been selected, If selectedAnswer is null, the button is disabled*/
  backBtn.disabled = currentQuestionIndex === 0; /*Disables the Previous button on the first question*/

  currentQuestion.answers.forEach(answer => { /*Loops through every answer option for the current question, */
    const button = document.createElement("button"); /*Loops through every answer option for the current question*/
    button.textContent = answer.text; /*Sets the button text to the answer text.*/
    button.classList.add("answerBtn"); /*Adds CSS class so the button can be styled*/

    if (selectedAnswer === answer.type) { /*Checks whether the answer was already selected before, this is useful for when the user selects the back button to return to a previous question*/
      button.classList.add("selected"); /*Adds the selected styling to the previously chosen answer*/
    }

    button.addEventListener("click", () => { /*When the user clicks the answer, either d,i,s,c is assigned*/
      selectedAnswer = answer.type;

      document.querySelectorAll(".answerBtn").forEach(btn => { /*Finds all answer buttons currently on the page and loops through them*/
        btn.classList.remove("selected"); /*Removes the selected styling from all answer buttons. This ensures only one answer looks selected.*/
      });

      button.classList.add("selected"); /*Adds selected styling to the button the user clicked.*/
      nextBtn.disabled = false;  /*Enables the Next button because the user has selected an answer*/
    });

    answerButtons.appendChild(button); /*Adds the newly created answer button to the page*/
  });
}  /*end of show questions function*/

nextBtn.addEventListener("click", () => { /*Runs when the Next button is clicked "eventlistner" */
  playButtonSound(); /*Runs when the Next button is clicked*/

  if (selectedAnswer === null) { /*Checks if no answer has been selected*/
    return; /*Stops the function if there is no selected answer*/
  } /*Ends the check*/

  userAnswers[currentQuestionIndex] = selectedAnswer; /*Stores the selected answer in the correct position in the userAnswers array*/
  currentQuestionIndex++; /* increments by moving to the next question*/

  if (currentQuestionIndex < quiz.length) { /*checks if there are questions left*/
    showQuestion(); /*Displays the next question*/
  } else { /*Runs if the user has finished all questions*/
    showResults();
  }
}); /*end of event listner for next question button*/

backBtn.addEventListener("click", () => { /*Runs when the previous question button is clicked "eventlistner" */
  playButtonSound(); /*Runs when the previous button is clicked*/

  if (currentQuestionIndex > 0) {  /*Checks that the user is not already on the first question*/
    currentQuestionIndex--; /*Moves back one question */
    showQuestion();  /*Moves back one question*/
  }
});  /*end of Previous button event listener*/

function calculateScores() { /*function to calculate the final DISC scores */
  const scores = { /*object to store totals for each DISC type */
    D: 0,
    I: 0,
    S: 0,
    C: 0
  };

  userAnswers.forEach(answer => { /*Loops through every answer the user selected //js shorthand anonymous quick function =>*/
    if (answer) { /*Check the answer exists */
      scores[answer]++; /*increments the score for that personality type*/
    }
  });

  return scores; /*Returns the score object*/
}

function getHighestScore(scores) { /*function to find the highest DISC score */
  const maxScore = Math.max(...Object.values(scores)); /*Finds the highest number in the scores */

  const winners = Object.keys(scores).filter(type => { /*Gets the DISC letters and filters them to only include the ones matching the highest score */
    return scores[type] === maxScore; /*Keeps only the typeS with the maximum score */
  }); /*end of function*/

  return winners; /*returns winning letters*/
}

function showResults() { /*function that prepares the final result*/
  const scores = calculateScores(); /*calculates the scores*/
  const results = getHighestScore(scores); /*Gets the winning personality type/S*/

  localStorage.setItem("personalityResult", JSON.stringify(results)); /*Stores the result in browser localStorage,, JSON.stringify() converts the array into text so it can be stored */
  localStorage.setItem("personalityScores", JSON.stringify(scores)); /*Stores the full score breakdown*/

  window.location.href = "result.html"; /*sends user to the results page*/
}

showQuestion(); /*Starts the quiz by displaying the first question.*/