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

function loadEditionLinks(available, e) {
  return getFolderMap()
    .then( folderMap => {
      return fetch('/assets/editions.json')
        .then( res => res.json())
        .then ( res => {
          const list = res.filter( e => e.id && e.title && !!available === !!folderMap[e.id])
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
        });
    })
    .catch( e => {
      console.error("Unable to read editions file. " + e.message)
    })
}

function loadCover(e) {
  const doc = e.target;
  const id = new URL(doc.URL).searchParams.get('id');
  const version = new URL(doc.URL).searchParams.get('version') || '00';

  return fetch('/assets/editions.json')
    .then ( res => res.json())
    .then ( res => {
      let item = res.find((e) => e.id === id);
      if (!item) {
        location.href = '/404';
        return false;
      }
      item.sku = item.sku || `${item.id}-${version}-${item.release}`
      item.year = item.release.slice(0,4);
      // version values override item values
      if (item.versions && item.versions[version]) {
        item = { ...item, ...item.versions[version]};
      }
      let q = new URLSearchParams({
        id: id,
        version: version,
        utm_source: 'sm',
        utm_medium: 'qr',
        utm_campaign: item.sku,
      })
      for (n of doc.getElementsByClassName('qr-code')) {
        new QRCode(n,{
          text: `https://www.maxjanowski.org/edition?${q.toString()}`,
          correctLevel: QRCode.CorrectLevel.M,
          width: 80,
          height: 80
        });
      }
      Object.keys(item).forEach(k => {
        const v = item[k];
        if (v) {
          for ( n of doc.getElementsByClassName(k)) {
            n.innerHTML = v;
          }
        }
      })
      return item;
    })
    // .catch( e => {
    //   console.error("Unable to read editions file. " + e.message)
    // });
}

function loadEditionPage(e) {
  const doc = e.target;
  const id = new URL(doc.URL).searchParams.get('id')

  return getFolderMap()
  .then ( folderMap => {
    if (folderMap[id]) {
      doc.getElementById('folderUrl').href = `https://drive.google.com/drive/folders/${folderMap[id]}?usp=sharing`;
      doc.getElementById('folderUrl').innerHTML = 'Download Performance Files';
    }
    return loadCover(e)
    .then ( item => {
      let loadImage = false;
      loadImage = new Promise( (resolve, reject) => {
        doc.getElementById('preview-image').onload = resolve;
        doc.getElementById('preview-image').onerror = resolve;
      })
      doc.getElementById('preview-image').src = `/images/preview/${item.id}-620x800.png`;
      doc.getElementById('preview-pdf').href = `/download/preview/${item.id}.pdf`;
      doc.title = item.title + ' | The Max Janowski Society';
      doc.getElementById('h1').innerHTML = item.title;
      if (item.features) {
        const featureList = item.features.map( e => `<li>${e}</li>`);
        doc.getElementById('feature-list').innerHTML =
          `This downloadable edition includes:<ul>${featureList.join('')}</ul>`;
      }

      return loadImage;
    })
    .then ( res => {
      doc.getElementById('edition-wrapper').classList.add('ready');
    })
    .catch( e => {
      console.error("Unable to read editions file. " + e.message)
    });
  })
}
