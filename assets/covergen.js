var $coverGen = {};

function coverGenInit() {
  return initItemFromQueryParms().then((item) => {
    revision = item.versions[$coverGen.version].revision;
    $coverGen.sku = `${item.id}-${$coverGen.version}-${revision}`;
    document.title = `${$coverGen.sku}-cover`;

    initDragDrop();
    console.log("init complete");
  });
}

async function editionLandingInit() {
  const folderUrlElem = document.getElementById("folderUrl");
  const previewImageElem = document.getElementById("preview-image");
  const previewPdfElem = document.getElementById("preview-pdf");
  const featureListElem = document.getElementById("feature-list");
  const h1Elem = document.getElementById("h1");
  const editionWrapperElem = document.getElementById("edition-wrapper");

  function setFolderLink(elem, idAndPriceCode) {
    return getFolderMap().then((folderMap) => {
      if (folderMap[idAndPriceCode]) {
        elem.href = `https://drive.google.com/drive/folders/${folderMap[idAndPriceCode]}?usp=sharing`;
        elem.innerHTML = "Download Performance Files";
      }
    });
  }

  function setPreviewImage(elem, pdfElem, id) {
    const promise = new Promise((resolve, reject) => {
      elem.onload = resolve;
      elem.onerror = resolve;
    });
    elem.src = `/images/preview/score-page-${id}-620x800.png`;
    pdfElem.href = `/download/preview/score-page-${id}.pdf`;
    return promise;
  }

  item = await initItemFromQueryParms();

  if (!item) {
    location.href = "/404.html";
    return;
  }
  const p1 = setFolderLink(folderUrlElem, item.id);
  const p2 = setPreviewImage(previewImageElem, previewPdfElem, item.id);

  document.title = item.title + " | The Max Janowski Society";
  h1Elem.innerHTML = item.title;
  if (item.features) {
    const featureList = item.features.map((e) => `<li>${e}</li>`);
    featureListElem.innerHTML = `This downloadable edition includes:<ul>${featureList.join(
      ""
    )}</ul>`;
  }

  return Promise.all([p1, p2])
    .then((res) => {
      loadPage(editionWrapperElem);
    })
    .catch((e) => {
      console.error("Unable to read editions file. " + e.message);
    });
}

async function getFileNameFromId(id) {
  res = await fetch(`/assets/release/index.json`);
  fileSet = await res.json();
  for (fileName of Object.keys(fileSet)) {
    if (fileName.startsWith(id)) {
      return ($coverGen.filename = fileName);
    }
  }
}

async function initItemFromQueryParms() {
  // get $coverGen item based on query parameters
  ["filename", "version", "id"].forEach((parm) => {
    $coverGen[parm] = new URL(document.URL).searchParams.get(parm);
  });
  if (!$coverGen.filename && $coverGen.id) {
    $coverGen.filename = await getFileNameFromId($coverGen.id);
  }
  if (!$coverGen.filename) {
    console.error("no query parameter for filename");
    return;
  }
  $coverGen.version ||= "00";
  try {
    res = await fetch(`/assets/release/${$coverGen.filename}`);
    text = await res.text();
    return ($coverGen.item = jsyaml.load(text));
  } catch {
    const errorMsg = document.getElementById("errormsg");
    if (errorMsg) {
      console.error(errorMsg);
      errorMsg.innerHTML = `${$coverGen.filename} is not on web site.  Use drag-and-drop to upload local file.`;
      errorMsg.classList.add("active");
    } else {
      location.href = "/404.html";
    }
  }
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
    reader.onload = (e) => {
      $coverGen.item = jsyaml.load(e.target.result);
      dd.innerText = $coverGen.filename;
      buildVersions();
      loadPage(pages);
      return true;
    };
    reader.readAsText(e.dataTransfer.files[0], "utf8");
    $coverGen.filename = e.dataTransfer.files[0].name;
  }

  function changeVersion(e) {
    pages.classList.remove("ready");
    $coverGen.version = sd.value;
    loadPage(pages);
  }

  function buildVersions() {
    const item = $coverGen.item;
    let lst;
    if (item.versions) {
      lst = Object.keys(item.versions).map((version) => {
        const sel = version == $coverGen.version ? " selected" : "";
        const label = item.versions[version].version;
        return `<option value="${version}"${sel}>${version}: ${label}</option>`;
      });
    } else {
      lst = [`<option value="00" selected>00: ${item.version}</option>`];
      $coverGen.version = "00";
    }
    sd.innerHTML = lst.join("");
    sd.classList.add("ready");
  }

  //get files element
  dd.ondragover = stop;
  dd.ondragleave = stop;
  document.ondrop = dragAccept;
  sd.onchange = changeVersion;
  setTimeout((e) => {
    document.body.scrollTop = 0; // For Safari
    document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
  });
  if ($coverGen.item) {
    buildVersions();
    loadPage(pages);
    dd.innerText = $coverGen.filename;
  }
}

function loadPage(wrapper) {
  wrapper.classList.remove("ready");
  let item = $coverGen.item;
  const version = $coverGen.version || "00";
  // version values override item values
  if (item.versions && item.versions[version]) {
    item = {
      ...item,
      ...item.versions[version],
    };
  }
  item.sku = `${item.id}-${version}-${item.revision}`;
  item.year = item.revision.slice(0, 4);
  const q = new URLSearchParams({
    id: item.id,
    productRelease: item.productRelease,
    utm_source: "sm",
    utm_medium: "qr",
    utm_campaign: item.sku,
  });
  for (n of document.getElementsByClassName("qr-code")) {
    n.innerHTML = "";
    new QRCode(n, {
      text: `https://www.maxjanowski.org/edition?${q.toString()}`,
      correctLevel: QRCode.CorrectLevel.M,
      useSVG: true,
    });
  }
  Object.keys(item).forEach((k) => {
    let v = item[k];
    if (v) {
      for (n of document.getElementsByClassName(k)) {
        v = v.replace(/([A-G])([♭♯♮])/, '$1<span class="accidental">$2</span>'); // mark accidentals
        if (["text_style"].includes(k)) {
          n.textContent = v;
        } else if (["version", "hebrew", "translation", "transliteration", "translation_credit"].includes(k)) {
          n.innerHTML = `${v.replace(/\n/g, "<br/>")}`;
        } else {
          n.innerHTML = v;
        }
      }
    }
  });
  wrapper.classList.add("ready");
  console.log(
    `SUCCESS: ${item.title}-${item.version}-${item.revision} generated. hebrew=${
      item.hebrew ? "yes" : "no"
    } translation=${item.translation ? "yes" : "no"}`
  );
}
