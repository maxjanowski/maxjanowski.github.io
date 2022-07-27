function setupMessageCounter(textareaId = "message", counterId = "counter") {
  document.getElementById(textareaId).onkeyup = (e) => {
    const counter = document.getElementById(counterId);
    counter.innerHTML = `${e.target.value.length}/${e.target.maxLength}`;
    counter.style.visibility = 'visible';
  };
}

// Control code for /order form
function setupPledgeControl() {
  const pledgeamt = document.getElementById("pledgeamt");
  function updateamt(radioBtn, amt) {
    if (radioBtn.checked) {
      pledgeamt.value = amt;
    }
  }
  document.getElementById("pledge250").onchange = (e) => updateamt(e.target, 250);
  document.getElementById("pledge50").onchange = (e) => updateamt(e.target, 50);
  pledgeamt.onfocus = (e) => document.getElementById("pledgeother").checked = true;
}
