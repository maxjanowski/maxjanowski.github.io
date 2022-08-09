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

function loadZipLinks(e) {
  let list = fetch('/assets/downloads.json')
    .then( res => res.json())
    .then ( res => {
      const list = res.filter( e => e['MimeType'] === 'application/zip' )
      .map( e => {
        const [x,sku,title] = /([0-9]+)\s*(.*)\.zip/.exec(e['Name']);
        const url = `https://drive.google.com/file/d/${e['ID']}/view`
        return { sku, url, title }
      })
      .sort((a,b)=> {
        return a['title'].toLowerCase().localeCompare(b['title'].toLowerCase());
      })
      .map( e => {
        return `<div>${e.sku}</div><div>
            <a href="${e.url}" title="Access and download this piece." target="_blank">
              ${e.title}
            </a>
          </div>`;
      });
      e.innerHTML = '<div>Number</div><div>Title</div>'+list.join('');
      console.log(list)
    });
  return true;
}
