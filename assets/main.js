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
  function updateamt(e) {
    if (e.target.checked) {
      pledgeamt.value = e.target.value;
    }
  }
  pledgeamt.onfocus = ((e) => {
    document.getElementById("pledgeother").checked = true;
  });
  [ "pledge250", "pledge50" ].forEach( (id) => {
    document.getElementById(id).onchange = updateamt;
  });
}
