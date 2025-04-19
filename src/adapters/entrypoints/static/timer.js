// OBSOLETE

function change_time() {
  const elements = document.querySelectorAll('[id^="rater-"]');
  elements.forEach((element) => {
    let time = element.textContent;
    const timeParts = time.split(':');
    if (timeParts.length !== 3) return;
    let seconds = Number(timeParts[2]);
    let minutes = Number(timeParts[1]);
    let hours = Number(timeParts[0]);
    seconds++;
    if (seconds >= 60) {
      seconds = 0;
      minutes++;
    }
    if (minutes >= 60) {
      minutes = 0;
      hours++;
    }
    if (hours >= 24) {
      hours = 0;
    }
    element.innerText = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  });
}
let timerId = setInterval(function() {
    change_time();
}, 1000);






