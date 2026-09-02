text = document.getElementById("dogtext");
dog = document.getElementById("annoyingdog");
let spin = 0;
let current = 0
function spindog() {
    current += spin/46;
     dog.style.transform = `rotate(${current}deg)`;
   requestAnimationFrame(spindog);
}



function dogclick() {
    spin += 1;
  
    text.textContent = '/// speed: ' + spin + " ///";
}

dog.addEventListener("click", dogclick);

spindog();