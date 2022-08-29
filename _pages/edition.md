---
title: Edition Landing Page
permalink: /edition
layout: default
---
<script src="https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.js" defer></script>
<script src="https://unpkg.com/js-yaml@4.1.0/dist/js-yaml.min.js" defer></script>
<script src="/assets/covergen.js"></script>

<div>
  <a id="backlink" href="/download#instructions">&lt; Back to List</a>
  <h1 id="h1">Performance Editions</h1>
</div>

The performance package contains the sheet music and all the associated
files for preparing the music for performance. You'll need a Google Account.

1. Click the Download button below to head over to our Google Drive.
1. Log in to Google using your email address (if you're not already logged in).
1. You may need to "Request Permission".  If so, you'll get an email with a download link.
1. Download the set of files by pressing Google's download button:
   <img class="download-button" src="/images/download-button.png"/>


<div id="edition-wrapper" class="edition-wrapper">
  <img id="spinner" class="spinner" src="/images/spinner.gif" />
  <div id="view-window" class="view-window">
    <div id="page-pair" class="page-pair">
      <div id="cover-page" class="cover-page preview-page">
        <p class="head">The Max Janowski Society · Performance Editions Series</p>
        <div>
          <p class="title"></p>
          <p class="version"></p>
        </div>
        <div>
          <p class="author"></p>
          <p class="edited"></p>
        </div>
        <p class="blurb"></p>
        <img class="page-break" src="/images/pagebreak-300x87.png" alt="pagebreak" />
        <div class="footer">
          <div class="catalog">
            <p class="catalog-number">TMJS Catalog Number: <span class='sku'></span></p>
                <p>© <span class="year"></span> The Max Janowski Society, NFP.</p>
                <p>www.maxjanowski.org</p>
          </div>
          <div class="qr-code"></div>
        </div>
      </div>
      <div id="sheet-preview" class="sheet-preview preview-page">
        <a id="preview-pdf" title="Click to preview a page of the sheet music." href="#" target="_blank">
          <img id="preview-image" src="#" />
        </a>
      </div>
    </div>
    <div id="feature-list" class="feature-list"></div>
    <center>
      <a id="folderUrl" class="button" href="/subscribe" target="_blank">
        Coming soon — Subscribe to get announcements.
      </a>
    </center>
  </div>
</div>
<script>
  window.onload = e => editionLandingInit();
</script>
