function setupMessageCounter(textareaId = "message", counterId = "counter") {
  document.getElementById(textareaId).onkeyup = (e) => {
    const counter = document.getElementById(counterId);
    counter.innerHTML = `${e.target.value.length}/${e.target.maxLength}`;
    counter.style.visibility = 'visible';
  };
}

function setupPreamble() {
  const msgs = {
    "t1": "I have a question!",
    "cd1": "Physical CDs aren't available quite yet, but send us a message"
          + " below with your postal address (and how many you want), and"
          + " we'll get in touch with you when they are.",
  }
  const msgId = new URL(document.URL).searchParams.get('msg');
  const preamble = document.getElementById('preamble');
  const msgText = msgs[msgId];
  if (msgText) {
    preamble.innerHTML = msgText;
  }
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

function loadEditionLinks(available, e) {
  let list = fetch('/assets/editions.json')
    .then( res => res.json())
    .then ( res => {
      const list = res.filter( e => e.id && e.title && !!available === !!e.folderId)
        .sort((a,b) => {
          return a['title'].toLowerCase().localeCompare(b['title'].toLowerCase());
        })
        .map( e => {
          return `<div>${e.id}</div><div>
              <a href="/edition?id=${e.id}" title="Access and download this piece.">
                ${e.title}
              </a>
            </div>`;
        });
      e.innerHTML = '<div>Number</div><div>Title</div>'+list.join('');
      console.log(list)
    });
  return true;
}

function loadEditionPage(e) {
  const doc = e.target;
  const id = new URL(doc.URL).searchParams.get('id')
  fetch('/assets/editions.json')
    .then ( res => res.json())
    .then ( res => {
      let item = res.find((e) => e['id'] === id);
      if (!item) {
        location.href = '/404';
        return false;
      }
      let loadImage = false;
      loadImage = new Promise( (resolve, reject) => {
        doc.getElementById('preview-image').onload = resolve;
        doc.getElementById('preview-image').onerror = resolve;
      })
      doc.getElementById('preview-image').src = `/images/preview/${id}-620x800.png`;
      doc.getElementById('preview-pdf').href = `/download/preview/${id}.pdf`;
      Object.keys(item).forEach(k => {
        const v = item[k];
        if ( k == 'title' ) {
          doc.title = v + ' | The Max Janowski Society';
          doc.getElementById('h1').innerHTML = v;
        }
        if ( k == 'folderId' ) {
          doc.getElementById('folderUrl').href = `https://drive.google.com/drive/folders/${v}?usp=sharing`;
          doc.getElementById('folderUrl').innerHTML = 'Download Performance Files';
        }
        if ( k == 'features' ) {
          const featureList = v.map( e => `<li>${e}</li>`);
          doc.getElementById('feature-list').innerHTML =
            `This downloadable edition includes:<ul>${featureList.join('')}</ul>`;
        }
        n = doc.getElementById(k);
        if (n) {
          n.innerHTML = v;
        }
      })
      return loadImage;
    })
    .then( res => {
      doc.getElementById('edition-wrapper').classList.add('ready');
    });
  return true;
}
