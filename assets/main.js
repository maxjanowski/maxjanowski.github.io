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


function catalogFetchZipLinks(e) {
  // google app script brad@maxjanowski.org Download Zip JSON
  let url = "https://script.google.com/macros/s/AKfycbxNyTjSm-oszb460VEILC60UoYwVWggb7sbXuCOj7UeUEQ5kRP6nidVgfEQ2hduOIE3/exec";
  fetch(url)
    .then( res => res.json())
    .then( json => {
      let list = json
        .sort((a,b)=> {
          return a['title'].toLowerCase().localeCompare(b['title'].toLowerCase());
        })
        .map( e => {
          return `
            <div>${e.sku}</div>
            <div>
              <a href="${e.url}" title="Access and download this piece.">
                ${e.title}
              </a>
            </div>`;
        })
      e.innerHTML = list.join('')
    });
}
