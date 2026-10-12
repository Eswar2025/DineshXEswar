/*
  TASK 3 (JS):
  The maximum length of a post is 50 characters.

  1. Every time the user types, #remaining shows 50 minus the number of characters typed.
  2. #remaining has the class "danger" when 0 or fewer characters are left
     (typing past 50 is allowed).
     Else it has the class "warning" when 10 or fewer characters are left.
     Otherwise it has neither class.
  3. The Post button is disabled when the text is empty (spaces only counts as empty)
     OR when the text is longer than 50 characters. Otherwise it is enabled.
  4. Clicking Clear empties the textarea, and everything goes back to the starting state:
     remaining = 50, no classes, Post button disabled.
*/

const textEle = document.getElementById('postText');
let remaininglengthEle = document.getElementById('remaining');
let remaininglength ;
const clearEle = document.getElementById('clearBtn') ;
const postBtnEle = document.getElementById('postBtn') ;

postBtnEle.disabled = true ;

textEle.addEventListener("input", function(){
   remaininglengthEle.innerText = 50 - textEle.value.length ;
   remaininglength = 50 - textEle.value.length ;

   let spaceremlengthEle = 50 - textEle.value.replace(/\s/g, "").length ;

   if((spaceremlengthEle == 50) || (remaininglength < 0)){
      postBtnEle.disabled = true ;
   }
   else{
      postBtnEle.disabled = false ;
   }


   if(remaininglength <= 0){
      remaininglengthEle.classList.remove("warning") ;
      remaininglengthEle.classList.add("danger") ;
   }
   else if(remaininglength <= 10){
      remaininglengthEle.classList.add("warning");
      remaininglengthEle.classList.remove("danger") ;
   }
   else{
      remaininglengthEle.classList.remove("warning");
      remaininglengthEle.classList.remove("danger");
   }

})

clearEle.addEventListener("click", function(){
   remaininglengthEle.classList.remove("warning");
   remaininglengthEle.classList.remove("danger") ;
   postBtnEle.disabled = true ;
   textEle.value = '';
   remaininglengthEle.innerText = 50 ;
})


