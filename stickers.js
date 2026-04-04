/* ============================================================
   CUSTOM DEMANDS — data/stickers.js
   ============================================================

   HOW TO EDIT:
   ─────────────────────────────────────────────────────────
   Each object in the STICKERS array is one card on the site.

   Fields:
     id       → unique number (keep sequential)
     name     → card title shown on the website
     desc     → short description shown under the name
     image    → path to image. Options:
                  null           → shows numbered placeholder
                  "images/s1.jpg"→ your image in /images/ folder
     style    → art style tag shown on the card
                  "kawaii" | "chibi" | "anime" | "anything" | "sticker"

   TO ADD A NEW CARD:
     Copy any object, paste it at the end of the array,
     increment the id, update name/desc/image/style, save.

   TO REMOVE A CARD:
     Delete the entire { ... } object for that card.

   TO CHANGE AN IMAGE:
     Put your image in the /images/ folder, then set
     image: "images/your-filename.jpg"
   ============================================================ */

const STICKERS = [

  {
    id:    1,
    name:  "Pain 1",
    desc:  "Pain......",
    image: "images/pain1.jpg",          // Replace null with "images/sticker1.jpg" when ready
    style: "sticker"
  },

  {
    id:    2,
    name:  "Sticker Design 2",
    desc:  "Custom die-cut sticker — your art, your colors, your style.",
    image: null,
    style: "sticker"
  },

  {
    id:    3,
    name:  "Kawaii Bunny Pack",
    desc:  "Adorable kawaii bunny sticker set — pastel pinks and big sparkly eyes.",
    image: null,
    style: "kawaii"
  },

  {
    id:    4,
    name:  "Chibi Character",
    desc:  "Your favourite anime character in full chibi style with bold outlines.",
    image: null,
    style: "chibi"
  },

  {
    id:    5,
    name:  "Anime Fan Art",
    desc:  "Anime-style fan art sticker with dynamic shading and crisp linework.",
    image: null,
    style: "anime"
  },

  {
    id:    6,
    name:  "Sticker Design 6",
    desc:  "Custom die-cut sticker — your art, your colors, your style.",
    image: null,
    style: "sticker"
  },

  {
    id:    7,
    name:  "Sticker Design 7",
    desc:  "Custom die-cut sticker — your art, your colors, your style.",
    image: null,
    style: "sticker"
  },

  {
    id:    8,
    name:  "Sticker Design 8",
    desc:  "Custom die-cut sticker — your art, your colors, your style.",
    image: null,
    style: "sticker"
  },

  {
    id:    9,
    name:  "Sticker Design 9",
    desc:  "Custom die-cut sticker — your art, your colors, your style.",
    image: null,
    style: "sticker"
  },

  {
    id:    10,
    name:  "Sticker Design 10",
    desc:  "Custom die-cut sticker — your art, your colors, your style.",
    image: null,
    style: "sticker"
  },

  {
    id:    11,
    name:  "Sticker Design 11",
    desc:  "Custom die-cut sticker — your art, your colors, your style.",
    image: null,
    style: "sticker"
  }

  /* ── TEMPLATE — copy & paste below this line to add a new card ──

  ,{
    id:    12,
    name:  "Your Sticker Name",
    desc:  "Your description here.",
    image: null,          // or "images/your-image.jpg"
    style: "sticker"      // kawaii | chibi | anime | anything | sticker
  }

  ── END TEMPLATE ── */

];
