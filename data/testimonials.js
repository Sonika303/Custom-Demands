/* ============================================================
   CUSTOM DEMANDS — data/testimonials.js
   ============================================================
   TO ADD:    Copy the template, paste at the bottom, fill in.
   TO REMOVE: Delete the entire { } block for that review.
   MEDIA:     Put files in /testimonials/ folder
              Set media: "testimonials/filename.jpg"  (or .png / .mp4)
   FIELDS:
     id        — unique number
     name      — reviewer's name
     handle    — "@handle" or "" to hide
     rating    — 1–5 stars
     text      — review text
     media     — image path (or null)
     mediaType — "image" | "video" | null
     style     — anime | hellokitty | harrypotter | kawaii | chibi | sticker
     date      — display date e.g. "January 2026"
   ============================================================ */

const TESTIMONIALS = [

  {
    id:        1,
    name:      "Chetan",
    handle:    "",
    rating:    5,
    text:      "Absolutely obsessed with my Pain sticker!! The quality is amazing and they understood exactly what I wanted. Will definitely order again!",
    media:     "testimonials/pain1.png",
    mediaType: "image",
    style:     "anime",
    date:      "January 2026"
  },

  {
    id:        2,
    name:      "Arjun K.",
    handle:    "",
    rating:    5,
    text:      "Got a chibi version of my OC and it came out PERFECT. The outlines are so crisp and the expression is exactly right. 10/10 recommend Custom Demands!",
    media:     null,
    mediaType: null,
    style:     "chibi",
    date:      "January 2026"
  },

  /*  ── ADD NEW REVIEW BELOW ──
  ,{
    id:        3,
    name:      "Customer Name",
    handle:    "@handle",
    rating:    5,
    text:      "Their review text here.",
    media:     "testimonials/photo.jpg",
    mediaType: "image",
    style:     "sticker",
    date:      "April 2026"
  }
  */

];