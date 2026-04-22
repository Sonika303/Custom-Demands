const STICKERS = [

  /* ── ANIME ── */
  { id: 1,  name: "Pain 1",       desc: "Pain Staring",                                              image: "images/anime/pain1.png",            style: "anime",       price: 10, inStock: true  },
  { id: 16, name: "Luffy 1",      desc: "Luffy fist in the air friendship symbol",                   image: "images/anime/luffy/luffy1.png",           style: "anime",       price: 10, inStock: true  },
  { id: 17, name: "Hakari 1",     desc: "Hakari doing his domain expansion pose",                    image: "images/anime/hakari1.png",          style: "anime",       price: 10, inStock: true  },
  { id: 18, name: "Gojo 1",       desc: "Gojo Satoru head with his sunglasses",                      image: "images/anime/gojo/gojo1.png",       style: "anime",       price: 10, inStock: true  },
  { id: 19, name: "Gojo 2",       desc: "Gojo Satoru running with blindfold and arms out",           image: "images/anime/gojo/gojo2.png",       style: "anime",       price: 10, inStock: true  },
  { id: 20, name: "Naruto 1",     desc: "Naruto Uzumaki in a low-crouching position",                image: "images/anime/naruto1.png",          style: "anime",       price: 10, inStock: true  },
  { id: 21, name: "Kurama 1",     desc: "Kurama the Nine-Tailed Fox Beast",                          image: "images/anime/kurama1.png",          style: "anime",       price: 10, inStock: true  },
  { id: 22, name: "L Lawliet 1",  desc: "Chibi L Lawliet with his distinctive hairstyle",            image: "images/anime/LLawliet1.png",        style: "anime",       price: 10, inStock: true  },
  { id: 23, name: "Itachi 1",     desc: "Funny Itachi Uchiha pose",                                  image: "images/anime/itachi/itachi1.png",          style: "anime",       price: 10, inStock: true  },
  { id: 24, name: "Itachi 2",     desc: "Itachi sitting pose with background",                       image: "images/anime/itachi/itachi2.png",          style: "anime",       price: 10, inStock: true  },
  { id: 25, name: "Goku 1",       desc: "Goku standing with angry face expression",                  image: "images/anime/goku1.png",            style: "anime",       price: 10, inStock: true  },
  { id: 26, name: "Zoro 1",       desc: "Zoro standing with his sword",                              image: "images/anime/zoro/zoro1.png",       style: "anime",       price: 10, inStock: true  },
  { id: 27, name: "Zoro 2",       desc: "Zoro posing with his three swords",                         image: "images/anime/zoro/zoro2.png",       style: "anime",       price: 10, inStock: true  },
  { id: 28, name: "Gojo 3",       desc: "Chibi Gojo with a cute smile",                              image: "images/anime/gojo/gojo3.png",       style: "anime",       price: 10, inStock: true  },
  { id: 29, name: "Sasuke 1",     desc: "Sasuke posing and holding his sword",                       image: "images/anime/sasuke/sasuke1.png",   style: "anime",       price: 10, inStock: true  },
  { id: 30, name: "Sasuke 2",     desc: "Kid Sasuke with headband and clan symbol doing jutsu pose", image: "images/anime/sasuke/sasuke2.png",   style: "anime",       price: 10, inStock: true  },
  { id: 32, name: "Wado Ichimonji, Sandai Kitetsu, and Enma 1",       desc: "Wado Ichimonji, Sandai Kitetsu, and Enma standing together",          image: "images/anime/swords/Wado Ichimonji, Sandai Kitetsu, and Enma 1.png",            style: "anime",       price: 10, inStock: true  },
  { id: 33, name: "luffy 2",     desc: "Kid Luffy peeking out with a straw hat",          image: "images/anime/luffy/luffy2.png",     style: "anime",       price: 10, inStock: true  }, 
 
  /* ── HELLO KITTY ── */
  { id: 2,  name: "Hello Kitty 1", desc: "Hello Kitty standing",                                     image: "images/HelloKitty/HelloKitty1.png", style: "hellokitty",  price: 10, inStock: true  },
  { id: 3,  name: "Hello Kitty 2", desc: "Adorable Hello Kitty peeking from behind a ribbon",        image: "images/HelloKitty/HelloKitty2.png", style: "hellokitty",  price: 10, inStock: true  },
  { id: 4,  name: "Hello Kitty 3", desc: "Hello Kitty head with a cute red bow",                     image: "images/HelloKitty/HelloKitty3.png", style: "hellokitty",  price: 10, inStock: true  },
  { id: 5,  name: "Hello Kitty 4", desc: "Hello Kitty sitting and holding a strawberry",             image: "images/HelloKitty/HelloKitty4.png", style: "hellokitty",  price: 10, inStock: true  },

  /* ── HARRY POTTER ── */
  { id: 6,  name: "Harry Potter 1",     desc: "Chibi Harry Potter holding his wand with iconic glasses",      image: "images/harrypotter/HarryPotter1.png",     style: "harrypotter", price: 10, inStock: true  },
  { id: 7,  name: "Hermione Granger 1", desc: "Chibi Hermione Granger with her characteristic bushy hair",    image: "images/harrypotter/HermioneGranger1.png", style: "harrypotter", price: 10, inStock: true  },
  { id: 8,  name: "Ron Weasley 1",      desc: "Chibi Ron Weasley with his red hair and freckles",             image: "images/harrypotter/RonWeasley1.png",      style: "harrypotter", price: 10, inStock: true  },
  { id: 9,  name: "Rubeus Hagrid 1",    desc: "Chibi Hagrid with his characteristic beard and kind eyes",     image: "images/harrypotter/RubeusHagrid1.png",    style: "harrypotter", price: 10, inStock: true  },
  { id: 10, name: "Severus Snape 1",    desc: "Chibi Snape with his characteristic scowl and dark hair",      image: "images/harrypotter/SeverusSnape1.png",    style: "harrypotter", price: 10, inStock: true  },
  { id: 11, name: "Albus Dumbledore 1", desc: "Chibi Dumbledore with long beard and half-moon glasses",       image: "images/harrypotter/AlbusDumbledore1.png", style: "harrypotter", price: 10, inStock: true  },
  { id: 12, name: "Draco Malfoy 1",     desc: "Chibi Draco with slicked-back blonde hair and sly expression", image: "images/harrypotter/DracoMalfoy1.png",     style: "harrypotter", price: 10, inStock: true  },
  { id: 13, name: "Luna Lovegood 1",    desc: "Chibi Luna with her distinctive hair and dreamy eyes",          image: "images/harrypotter/LunaLovegood1.png",    style: "harrypotter", price: 10, inStock: true  },
  { id: 14, name: "Sorting Hat 1",      desc: "Chibi Sorting Hat with its distinctive shape and wise face",    image: "images/harrypotter/SortingHat1.png",      style: "harrypotter", price: 10, inStock: true  },
  { id: 15, name: "Harry Potter Logo 1",desc: "Harry Potter iconic lightning bolt logo",                       image: "images/harrypotter/HarryPotterLogo1.png", style: "harrypotter", price: 10, inStock: true  },

  /* ── MARVEL ── */
  { id: 31, name: "Spider-Man 1",  desc: "Spider-Man Hanging in the Air with the web",            image: "images/marvel/spiderman1.png",  style: "marvel", price: 10, inStock: true  },
];