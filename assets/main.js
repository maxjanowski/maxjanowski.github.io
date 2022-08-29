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

function getFolderMap() {
  return fetch('/assets/fids.json')
    .then( res => res.json())
    .then( res => {
      const folderMap = {}
      res.forEach( e => {
        if (e.IsDir) {
          folderMap[e.Name.slice(0,5)] = e.ID
        }
      })
      return folderMap;
    })
    .catch( e => {
      console.error("Unable to read fids file. " + e.message);
    })
}

function formatDate(item) {
  const s = item.release;
  if (!s) {
    return 'soon';
  }
  return new Date(s.substr(0,4),s.substr(4,2)-1,s.substr(6,2)).toLocaleDateString()
}
function loadEditionLinks(available, e) {
  return getFolderMap()
    .then( folderMap => {
      return fetch('/assets/release/index.json')
        .then( res => res.json())
        .then ( res => {
          const list = Object.keys(res).map(id => ({id:id, ...res[id]}))
            .filter( e => (!!available === !!folderMap[e.id]))
            .sort((a,b) => {
              return a['title'].toLowerCase().localeCompare(b['title'].toLowerCase());
            })
            .map( e => {
              return `<tr><td>
                  <a href="/edition?id=${e.id}&amp;release=${e.release}" title="Access and download this piece.">
                    ${e.title}
                  </a>
                </td><td>released ${formatDate(e)}</td></tr>`;
            });
          e.innerHTML = list.join('');
        });
    })
    .catch( e => {
      console.error("Unable to read editions file. " + e.message)
    })
}
