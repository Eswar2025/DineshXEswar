// Write your code below
const headingEle = document.getElementById("title");
const paraEle = document.querySelector(".description");
const cardBox = document.getElementById("card");

function changeTxtFn() {
  headingEle.innerText = "Hello, DOM!";
  paraEle.innerText = "I changed this with JavaScript.";
}

// const headColEle = document.getElementById('title')
function makeItPrettyFn(){
    headingEle.style.color = 'tomato'
    cardBox.classList.add("highlight")
}
