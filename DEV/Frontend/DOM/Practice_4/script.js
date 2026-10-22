/*
  TASK 3 (JS):
  1. Clicking the button toggles the class "dark" on the <body>.
  2. When the dark theme is ON:
       - the button text is "Light Mode"
       - the button attribute aria-pressed is "true"
  3. When the dark theme is OFF:
       - the button text is "Dark Mode"
       - the button attribute aria-pressed is "false"
*/

const darkBtnEle = document.getElementById('themeBtn');
const bodyEle = document.body;

darkBtnEle.addEventListener("click", function(modeChange){
     bodyEle.classList.toggle('dark');
})