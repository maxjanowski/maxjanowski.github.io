---
title: Edition Landing Page
permalink: /edition
layout: default
---

<div>
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
      <div id="cover-page" class="cover-page">
        <p id="head">The Max Janowski Society · Performance Editions Series</p>
        <div>
        <p id="title"></p>
        <p id="forces"></p>
        </div>
        <div>
        <p id="author"></p>
        <p id="edited"></p>
        </div>
        <p id="blurb"></p>
        <img class="page-break" src="/images/pagebreak-300x87.png" alt="pagebreak" />
        <div class="qr-code"></div>
        <div class="cover-footer">
          <p class="catalog-number">TMJS Catalog Number: <span id='id'></span>-<span id='release'></span></p>
          <p>© <span id="year"></span> The Max Janowski Society, NFP.</p>
          <p>www.maxjanowski.org</p>
        </div>
      </div>
      <div id="sheet-preview" class="sheet-preview">
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
  window.onload = e => loadEditionPage(e);
</script>
