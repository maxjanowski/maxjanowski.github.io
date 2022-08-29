var $coverGen = {};

function coverGenInit() {
  return initItemFromQueryParms()
    .then(item => {
      initDragDrop();
      console.log('init complete')
    })
}

function editionLandingInit() {

  const folderUrlElem = document.getElementById('folderUrl')
  const previewImageElem = document.getElementById('preview-image')
  const previewPdfElem = document.getElementById('preview-pdf')
  const featureListElem = document.getElementById('feature-list')
  const h1Elem = document.getElementById('h1')
  const editionWrapperElem = document.getElementById('edition-wrapper')

  function setFolderLink(elem, id) {
    return getFolderMap()
      .then(folderMap => {
        if (folderMap[id]) {
          elem.href = `https://drive.google.com/drive/folders/${folderMap[id]}?usp=sharing`;
          elem.innerHTML = 'Download Performance Files';
        }
      })
  }

  function setPreviewImage(elem, id) {
    const promise = new Promise( (resolve, reject) => {
      previewImageElem.onload = resolve;
      previewImageElem.onerror = resolve;
    });
    previewImageElem.src = `/images/preview/${id}-620x800.png`;
    previewPdfElem.href = `/download/preview/${id}.pdf`;
    return promise;
  }

  return initItemFromQueryParms()
    .then(item => {
      const p1 = setFolderLink(folderUrlElem, item.id);
      const p2 = setPreviewImage(previewImageElem, item.id);

      document.title = item.title + ' | The Max Janowski Society';
      h1Elem.innerHTML = item.title;
      if (item.features) {
        const featureList = item.features.map(e => `<li>${e}</li>`);
        featureListElem.innerHTML =
          `This downloadable edition includes:<ul>${featureList.join('')}</ul>`;
      }

      return Promise.all([p1, p2])
        .then(res => {
          loadPage(editionWrapperElem);
        })
        .catch(e => {
          console.error("Unable to read editions file. " + e.message)
        });
    })
}

function initItemFromQueryParms() {
  // get $coverGen item based on query parameters
  ['id', 'version', 'release'].forEach(parm => {
    $coverGen[parm] = new URL(document.URL).searchParams.get(parm);
  });
  if (!$coverGen.id || !$coverGen.release) {
    console.log('no query parameters for id and release')
    return Promise.resolve();
  }
  $coverGen.filename = `${$coverGen.id}-${$coverGen.release}.yaml`;
  return fetch(`/assets/release/${$coverGen.filename}`)
    .then(res => res.text())
    .then(text => {
      $coverGen.item = jsyaml.load(text);
      return $coverGen.item;
    })
    .catch(err => {
      const errorMsg = document.getElementById('errormsg');
      if (errorMsg) {
        console.log(err);
        errorMsg.innerHTML = `${$coverGen.filename} is not on web site.  Use drag-and-drop to upload local file.`;
        errorMsg.classList.add('active');
      } else {
        location.href = '/404.html';
      }
    })
}

function initDragDrop() {
  const dd = document.getElementById("dragdrop");
  const sd = document.getElementById("select-version");
  const pages = document.getElementById("pages");
  if (!dd || !sd || !pages) {
    return;
  }

  function stop(e) {
    e.stopPropagation();
    e.preventDefault();
  }

  function dragAccept(e) {
    stop(e);
    reader = new FileReader();
    reader.onload = e => {
      $coverGen.item = jsyaml.load(e.target.result);
      dd.innerText = $coverGen.filename;
      buildVersions();
      loadPage(pages);
      return true;
    }
    reader.readAsText(e.dataTransfer.files[0], 'utf8');
    $coverGen.filename = e.dataTransfer.files[0].name;
  }

  function changeVersion(e) {
    pages.classList.remove('ready');
    $coverGen.version = sd.value;
    loadPage(pages)
  }

  function buildVersions() {
    const item = $coverGen.item;
    let lst;
    if (item.versions) {
      lst = Object.keys(item.versions).map(version => {
        const sel = (version == $coverGen.version) ? ' selected' : '';
        const label = item.versions[version].version;
        return `<option value="${version}"${sel}>${version}: ${label}</option>`
      })
    } else {
      lst = [`<option value="00" selected>00: ${item.version}</option>`];
      $coverGen.version = '00';
    }
    sd.innerHTML = lst.join('');
    sd.classList.add('ready');
  }


  //get files element
  dd.ondragover = stop;
  dd.ondragleave = stop;
  document.ondrop = dragAccept;
  sd.onchange = changeVersion;
  setTimeout(e => {
    document.body.scrollTop = 0; // For Safari
    document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
  });
  if ($coverGen.item) {
    buildVersions()
    loadPage(pages)
    dd.innerText = $coverGen.filename;
  }
}

function loadPage(wrapper) {
  wrapper.classList.remove('ready')
  let item = $coverGen.item;
  const version = $coverGen.version || '00';
  item.sku = `${item.id}-${version}-${item.release}`
  item.year = item.release.slice(0, 4);
  // version values override item values
  if (item.versions && item.versions[version]) {
    item = {
      ...item,
      ...item.versions[version]
    };
  }
  const q = new URLSearchParams({
    id: item.id,
    version: version,
    utm_source: 'sm',
    utm_medium: 'qr',
    utm_campaign: item.sku,
  })
  for (n of document.getElementsByClassName('qr-code')) {
    n.innerHTML = '';
    new QRCode(n, {
      text: `https://www.maxjanowski.org/edition?${q.toString()}`,
      correctLevel: QRCode.CorrectLevel.M,
      width: 80,
      height: 80
    });
  }
  Object.keys(item).forEach(k => {
    const v = item[k];
    if (v) {
      for (n of document.getElementsByClassName(k)) {
        n.innerHTML = v.replace("\n","<br/><br/>");
      }
    }
  })
  wrapper.classList.add('ready')
}
