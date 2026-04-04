/* ============================================================
   CUSTOM DEMANDS — data/testimonials.js
   ============================================================

   HOW TO EDIT:
   ─────────────────────────────────────────────────────────
   Each object in TESTIMONIALS is one review card on the site.

   Fields:
     id        → unique number (keep sequential)
     name      → customer's name
     handle    → their social handle e.g. "@shreyaarts" (optional, use "" to hide)
     rating    → number 1–5 (shows filled stars)
     text      → their review text (keep under ~200 chars for best display)
     media     → path to image or video in /testimonials/ folder (or null)
     mediaType → "image" | "video" | null
     style     → which art style they ordered: "kawaii"|"chibi"|"anime"|"anything"|"sticker"
     date      → display date string e.g. "Jan 2025"

   MEDIA FILES:
     Put all customer photos and videos inside the /testimonials/ folder.
     Then set:  media: "testimonials/customer-photo.jpg"
            or  media: "testimonials/customer-review.mp4"

   TO ADD A REVIEW:
     Copy the template at the bottom, paste it, fill in the details.

   TO REMOVE A REVIEW:
     Delete the entire { ... } object.
   ============================================================ */

const TESTIMONIALS = [

  {
    id:        1,
    name:      "Shreya M.",
    handle:    "@shreyaarts",
    rating:    5,
    text:      "Absolutely obsessed with my kawaii bunny stickers!! The quality is amazing and the artist understood exactly what I wanted. Will order again for sure! 🌸",
    media:     "testimonials/pain1.png",            // e.g. "testimonials/shreya-review.jpg"
    mediaType: "image",          // "image" or "video"
    style:     "kawaii",
    date:      "Dec 2024"
  },

  {
    id:        2,
    name:      "Arjun K.",
    handle:    "@arjun.ink",
    rating:    5,
    text:      "Got a chibi version of my OC and it came out PERFECT. The outlines are so crisp and the expression is exactly right. 10/10 recommend Custom Demands!",
    media:     null,
    mediaType: null,
    style:     "chibi",
    date:      "Jan 2025"
  },

  {
    id:        3,
    name:      "Priya R.",
    handle:    "",
    rating:    5,
    text:      "Ordered a custom anime sticker pack for my laptop. The shading and linework is genuinely impressive. Fast delivery and super responsive. Love it!",
    media:     null,
    mediaType: null,
    style:     "anime",
    date:      "Jan 2025"
  },

  {
    id:        4,
    name:      "Rohan S.",
    handle:    "@rohan.creates",
    rating:    5,
    text:      "I sent in a rough sketch and they turned it into something stunning. The attention to detail is unreal. My friends keep asking where I got it from.",
    media:     null,
    mediaType: null,
    style:     "anything",
    date:      "Feb 2025"
  },

  {
    id:        5,
    name:      "Naina T.",
    handle:    "@nainadraws",
    rating:    5,
    text:      "The kawaii stickers turned out even cuter than I imagined 😭✨ Packaging was careful and they arrived in perfect condition. Highly recommend!",
    media:     null,
    mediaType: null,
    style:     "kawaii",
    date:      "Feb 2025"
  },

  {
    id:        6,
    name:      "Vikram D.",
    handle:    "",
    rating:    4,
    text:      "Really happy with my order. The quality is great and the process was smooth. Took a couple of days longer than expected but totally worth the wait.",
    media:     null,
    mediaType: null,
    style:     "sticker",
    date:      "Mar 2025"
  }

  /* ── TEMPLATE — copy & paste below to add a review ──

  ,{
    id:        7,
    name:      "Customer Name",
    handle:    "@handle",           // or "" to hide
    rating:    5,                   // 1 to 5
    text:      "Their review text here.",
    media:     "testimonials/photo.jpg",   // or null
    mediaType: "image",             // "image" | "video" | null
    style:     "sticker",           // kawaii | chibi | anime | anything | sticker
    date:      "Apr 2025"
  }

  ── END TEMPLATE ── */

];
