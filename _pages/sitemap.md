---
permalink: /sitemap
title: Site Map
sitemap: false
layout: default
---

# Site Map

The Max Janowski Society

{%- for group in site.navbar %}
  - {{ group[0] }}
  {%- for path in group[1] -%}
    {%- assign this_page = site.pages | where: "path",path | first %}
    - [{{ this_page.long_title | default: this_page.title }}]({{this_page.url | relative_url }})
  {%- endfor -%}
{%- endfor -%}
