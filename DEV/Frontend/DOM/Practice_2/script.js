const Aele = document.querySelector("#inputA");
const Bele = document.querySelector("#inputB");

// // function swapFn(){
// //   const temp = Bele.value;
// //   Bele.value = Aele.value;
// //   Aele.value = temp;
// // }

// const SwapBtn = document.querySelector('.swap-btn');

document
  .querySelector(".swap-btn")
  .addEventListener("click", function (dinesh) {
    const temp = Bele.value;
    Bele.value = Aele.value;
    Aele.value = temp;
  });
