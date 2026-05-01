/*this file is responsible for displaying the final result to the user, It retrieves stored data from localStorage, determines which personality type the user has and dynamically updates the results page with a title for user type,description, image and score breakdown */
/* below const variables are references to HTML elements where results will be displayed*/
const resultTitle = document.getElementById("resultTitle");
const resultDescription = document.getElementById("resultDescription");
const scoreBreakdown = document.getElementById("scoreBreakdown");
const resultImagesContainer = document.getElementById("resultImagesContainer");
/* results & score is retrieving stored data from localStorage saved in script.js*/
const results = JSON.parse(localStorage.getItem("personalityResult"));
const scores = JSON.parse(localStorage.getItem("personalityScores"));

/*Object descriptions contains information for each DISC personality type. Each type includes a title, description, and image, alt is used for if the image fails to load or for impaired users e.g. a screen reader */
const descriptions = {
  D: {
    title: "Dominance (D)",
    description: "You are confident, decisive, and results focused. You are likely to enjoy taking charge, solving problems quickly, and working towards clear goals.",
    image: "images/dominant.jpg",
    alt: "Image representing Dominance personality type"
  },
  I: {
    title: "Influence (I)",
    description: "You are outgoing, enthusiastic and people focused. You are likely to enjoy social situations, motivating others, and expressing ideas creatively.",
    image: "images/influence.jpg",
    alt: "Image representing Influence personality type"
  },
  S: {
    title: "Steadiness (S)",
    description: "You are calm, reliable and supportive. You are likely to value stability, teamwork, patience, and helping others feel comfortable.",
    image: "images/steadiness.jpg",
    alt: "Image representing Steadiness personality type"
  },
  C: {
    title: "Compliance (C)",
    description: "You are careful, analytical and detail focused. You are likely to value accuracy, structure, planning, and making decisions based on facts.",
    image: "images/compliance.jpg",
    alt: "Image representing Compliance personality type"
  }
};

if (results && results.length > 0) {      /*Checks if result AND if length of result is greater than 0 // this is collecting personalityResult from script which in turn is reading result which leads back to variable "score" in function calculateScores in script.js this is to check if the user has a result to display */
  const titles = []; /*creates an empty array to store result title or titles depending on if there is a tie */
  let descriptionsText = ""; /*This will store the result descriptions as HTML text, it is left empty to be populated depending on result */
  let imagesHTML = ""; /*this will store the text of the image file*/

  results.forEach(type => { /*looping through all results in the results array with an arrow function "=> arrow FUNCTION in JS is anonynomous with one outcome like lambdas in python" , so loop will check against D,I,S,C to see how many are chosen  */
    const data = descriptions[type]; /*Uses the result letter to find the matching data */

    titles.push(data.title); /*Adds the personality title to the title array with .push */
    descriptionsText += `<p>${data.description}</p>`; /*Adds the personality description inside a paragraph tag, {data.description} inserts the description value into the template string // $ is shorthand for j query object allows you to select an element and add the css */
    imagesHTML += `<img src="${data.image}" alt="${data.alt}" class="resultImage">`; /*Adds an image tag as text, ${data.image} becomes the image file path, ${data.alt} becomes the image alt descriptive text */
  }); /*end of loop*/

  if (results.length > 1) { /* this IF statment Checks if there is more than one result, if there is more than 1 result this means there was a tie between more than 1 results */
    resultTitle.textContent = `Mixed Result: ${titles.join(" + ")}`; /*Displays a mixed result title, titles.join(" + ") combines 2 outcomes to be displayed */
  } else { /* the else statement only runs if there is 1 result which leads */
    resultTitle.textContent = titles[0]; /*Displays the first and only result title, in arrays or lists the first element begins from 0*/
  }

  resultDescription.innerHTML = descriptionsText; /*places the description HTML into the page, Uses innerHTML because descriptionsText contains <p> tags */
  resultImagesContainer.innerHTML = imagesHTML; /*Places the generated image HTML into the page. This displays one image or multiple images if there is a tie*/

  if (scores) { /* Checks the score data exists. scoreBreakdown.innerHTML Starts inserting score information into the page using string data type.  Displays each DISC score. <br> creates line breaks */
    scoreBreakdown.innerHTML = `  
      Dominance: ${scores.D}<br>
      Influence: ${scores.I}<br>
      Steadiness: ${scores.S}<br>
      Compliance: ${scores.C}
    `;
  }
} else {    /*this else block will run if no results are found for whatever reason */
  resultTitle.textContent = "No result found";
  resultDescription.textContent = "Please complete the quiz first to see your result.";
  scoreBreakdown.textContent = "";
  resultImagesContainer.innerHTML = "";
}