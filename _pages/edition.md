---
title: Edition Landing Page
permalink: /edition
layout: default
---


<div class="edition-landing">
  <div class="cover-page">
    <center>
      <p id="head">The Max Janowski Society Performance Editions Series</p>
      <p id="title">Loading...</p>
      <p id="author"></p>
      <p id="edited"></p>
      <p id="blurb"></p>
      <img src="/images/pagebreak-300x87.png" alt="pagebreak" />
    </center>


    <p class="catalog-number">TMJS Catalog Number: <span id='id'></span>-<span id='release'></span></p>

    <div class="copyright">© <span id="year"></span> The Max Janowski Society NFP</div>
  </div>
  <div class="sheet-preview">
    <img id="sheetPreviewUrl" src="#" />
  </div>
</div>

---

The performance package contains the sheet music and all the associated files
for performance preparation.

<a id="zipFileUrl" href="#">Download Performance Package</a>

<script>
  window.onload = (e) => {
    id = new URL(location.href).searchParams.get('id')
    fetch('/assets/editions.json')
      .then ( res => res.json())
      .then ( res => {
        res.forEach( item => {
          if (parseInt(item['id']) === parseInt(id)) {
            Object.keys(item).forEach(k => {
              const v = item[k];
              if ( k == 'title' ) {
                document.title = v + ' | The Max Janowski Society';
              }
              if ( k == 'sheetPreviewId' ) {
                document.getElementById('sheetPreviewUrl').src = `http://drive.google.com/uc?export=view&id=${v}`;

              }
              if ( k == 'zipFileId' ) {
                document.getElementById('zipFileUrl').href = `http://drive.google.com/uc?export=download&id=${v}`;

              }
              n = document.getElementById(k);
              if (n) {
                n.innerHTML = v;
              }
            })
          }
        })

      })
    return true;
  }
</script>
