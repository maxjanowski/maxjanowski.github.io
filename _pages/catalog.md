---
layout: default
title: Music Catalog
permalink: /catalog
---

For each of the Max Janowski compositions in our library, we have created
performance packages that contain tools for your performers:

* Sheet music in one or more keys.
* Audio files of the piece for rehearsal preparation, including audio that highlights each choral part.

Once you have downloaded a performance packet, we encourage you to share it
with your performers (you don't need to buy a copy for each person).

# Instructions

* Click on a link below.
* Log in to your Google account.
* Click the "Request Access" button (if you don't already have access)
* Download the entire package by clicking the download icon.

<div id="editions-list" class="editions-list">
<span class="loading">Loading...</span>
</div>

<script>
function loadZipLinks(json) {
  let list = json
    .sort((a,b)=> {
      return a['title'].toLowerCase().localeCompare(b['title'].toLowerCase());
    })
    .map( e => {
      return `<div>${e.sku}</div><div>
          <a href="${e.url}" title="Access and download this piece.">
            ${e.title}
          </a>
        </div>`;
    });

  document.getElementById('editions-list').innerHTML = '<div>Number</div><div>Title</div>'+list.join('');
}
</script>
<script src="https://script.google.com/macros/s/AKfycbwkRx-88AXcAr-8_NIpuBIsNicULEi3AkqASbOu1h0sQfXdl6l0uXYGMR9TH_pd9OnD/exec?callback=loadZipLinks">
</script>
