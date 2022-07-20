---
layout: default
title: Contact Us
permalink: /contact
google_recaptcha: 6LdM1gUhAAAAAJxv23v32M_GSnUWLSqy3ygmD1md
---

# Contact Us

<div id="contactform">
<img title="Send us an email!" alt="contact banner" src="/images/DearMax-Banner-600x300.png" />

<form class="contact" action="https://getform.io/f/85384775-656e-481d-abb8-b1e4aa9ef5b1" method="POST">
    <input type="hidden" name="g-recaptcha-response"/>
    <label for="firstname">First Name</label>
    <input type="text" id="firstname" name="firstname">
    <label for="lastname">Last Name</label>
    <input type="text" id="lastname" name="lastname">
    <label for="email">Email *</label>
    <input type="email" id="email" name="email">
    <div id="message">
    <label for="message">Message *
    </label>
    <span id="counter">0/1000</span>
    <textarea onkeyup="javascript:updatecounter(this)" maxlength="1000" rows="8" id="message" name="message"></textarea>
    </div>
    <input type="checkbox" id="subscribe" name="subscribe" checked>
    <label for="subscribe">Subscribe to our newsletter</label>
    <center>
    <button type="submit">Send</button>
    </center>
</form>
</div>


<script>
var counter = document.getElementById("counter");
function updatecounter(e) {
  counter.innerHTML = `${e.value.length}/${e.maxLength}`
}
</script>

{%- include recaptcha.html -%}
