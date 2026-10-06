const AEle = document.getElementById("inputA");
const BEle = document.getElementById("inputB");

const swapEle = document.querySelector(".swap-btn");

swapEle.addEventListener("click", function SwapFn(event) {
  const temp = AEle.value;

  AEle.value = BEle.value;
  BEle.value = temp;
});

// if(AEle.value == "")