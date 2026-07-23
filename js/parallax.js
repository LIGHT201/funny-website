

document.addEventListener("DOMContentLoaded", () => {

    let containter = document.getElementById("cont");
  containter.style.position = "absolute";
window.addEventListener('mousemove', (event) => {
  const x = event.clientX; 
  const y = event.clientY;
  // i stole the mouseevent code from the internet lmaoo
  

  containter.style.top = `${y/9}px`;
  containter.style.left = `${x/15}px`;
  containter.style.filter = `drop-shadow(${x/13}px ${y/14}px ${(x+y)/199}px #00000038)`

  
});
})