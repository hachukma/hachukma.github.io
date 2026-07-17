# Hachukma Script

![Platform](https://img.shields.io/badge/Platform-Web-blue?style=flat-square)
![Status](https://img.shields.io/badge/Status-Static%20Site-success?style=flat-square)
![Language](https://img.shields.io/badge/Language-English-yellow?style=flat-square)

<div align="center">
  <h2>Modern Pictographic Alphabet for Kokborok</h2>
  <p>A clean web presentation of the Hachukma Script — a modern, acrophonic writing system for the Kokborok language.</p>
</div>

---

> ### ⚠️ Important Notice
> **This script is not officially implemented in Tripura, India, as of now.**  
> It is presented for **demonstration and discussion**. Your support and sharing for future implementation are highly welcome!

---

## 🎯 Overview

The **Hachukma Script** is a modern pictographic alphabetic writing system for the Kokborok language. Designed on the **acrophonic principle**, it transforms 26 culturally significant objects, tools, and natural elements of Borok life into a high-speed script for the digital age.

- **26 alphabetic characters** (vowels & consonants)
- **10 numerals** (0–9)
- **1 high-tone diacritic** — making a complete writing system of 37 glyphs.

Writing speed ranges from **1.8 seconds** for short words to **6.8 seconds** for longer ones.

The name *Hachukma* comes from the Kokborok word *hachuk* (hill or mountain). This script honours the cultural landscape of the Tripuri people — its symbols are drawn from traditional tools, household items, body parts, arthropods, birds, and plants that are part of everyday Borok life. Each character visually represents an object, but functions purely as a phonetic sign in actual use.

---

## ✨ About the Script

### Kokborok Language

Kokborok (also known as Tripuri or Tiprakok) is a Tibeto-Burman language spoken primarily in the Indian state of Tripura and neighbouring areas of Bangladesh. The name *Kokborok* comes from *kók* meaning "verbal" or "language" and *borok* meaning "people" or "human".

- Approximately **1.3 million native speakers** (2011 Census).
- Recognised as an **official language of Tripura** in 1979.
- Taught in schools since the 1980s.

### Ancient Roots

Kokborok is one of the ancient languages of Northeast India, with its existence attested since at least the **1st century AD**. The earliest known writing was recorded in a script called **Koloma**. Historical records of the Tripuri kings were written in the *Rajratnakar* (or *Rajmala*) using Koloma.

From the 19th century, Kokborok began to be written with the **Bengali** and later the **Latin (Roman) alphabet** — which has become the standard today. The **Hachukma Script** is a new neography, created to address the modern needs of the Kokborok-speaking community, combining cultural authenticity with digital adaptability and speed.

---

## 🔤 The Alphabet & Numerals

### Vowels

The six vowel characters:

| /a/ | /e/ | /i/ | /o/ | /u/ | /ɘ/ |
|-----|-----|-----|-----|-----|-----|

### Consonants

All 20 consonant characters with IPA pronunciation:

| /b/ | /tʃ/ | /d/ | /g/ | /h/ | /dʒ/ | /k/ | /kʰ/ | /l/ | /m/ |
|-----|------|-----|-----|-----|------|-----|------|-----|-----|
| /n/ | /ŋ/  | /p/ | /pʰ/ | /r/ | /s/  | /t/ | /tʰ/ | /w/ | /j/ |

### Tone Diacritic

A high-tone marker is used for tonal variation in Kokborok.

- **Desktop:** double‑tap the `P` key to apply the high tone.
- **Mobile:** tap the dedicated tone key after typing the base character.

### Numerals

The Hachukma numeral system from 0 to 9:

`0 1 2 3 4 5 6 7 8 9`

---

## 🖌 Design Philosophy

### Direct Pictographs

The majority of Hachukma characters are **direct pictographs** — the visual form is taken directly from a physical object. Examples include:

- `/b/` — *Buphang* (death tree)
- `/d/` — *Dangdol* (bamboo clothesline)
- `/g/` — *Golari* (slingshot)
- `/k/` — *Kowai-buphang* (areca nut tree)
- `/t/` — *Tok-thunta* (woodpecker)
- `/w/` — *Wa* (bamboo)

> **Acrophonic Exception:** *Wasung* (bamboo tube) represents the final sound `/ŋ/` rather than its initial `/w/`. This deliberate exception was made because the bamboo tube's visual form is beautiful and fast to write, and it neatly fits the phonological need for a final nasal.

### Indirect Pictographs

For certain sounds, Hachukma uses **indirect pictographs** — symbols derived from conceptual words or abstract ideas:

- `/a/` — from *Ang* (self / "I")
- `/i/` — from *aikha* (morning)
- `/ch/` — from *Chɘng* (we / "us")
- `/e/` — from *imang* (dream)
- `/ɘ/` — from *rɘ* (to give), representing its vowel sound

### Selection Process

Only the most elegant and efficient forms were retained through an extensive exploration of Borok material culture. This ensures every character is both culturally meaningful and exceptionally quick to write.

### Why an Alphabetic (Acrophonic) System?

- **Memorability** – Learners can recall the sound by remembering the object's name, making the entire alphabet memorisable within 8–15 weeks.
- **Technological compatibility** – A small character set (26 letters + numerals + diacritic) is essential for digital processing, keyboard efficiency, and programming applications.

---

## 💻 Technology & Future Compatibility

The Hachukma Script was designed with technology and future digital applications in mind. Its systematic, phonemic structure makes it a strong candidate for **Kokborok-based programming languages** — enabling native speakers to code in their own mother tongue and fostering technological sovereignty within the Tripuri community.

> *Hachukma is not merely a writing system but a bridge between tradition and innovation.*

---

## 📜 Historical Context: The Koloma Script

Historically, the **Koloma script** was used to write Kokborok, particularly within the royal palace of Tripura. However, over the centuries, it fell out of active use and has now vanished completely.

The **Hachukma Script is not a revival of Koloma** — it is a new neography, created specifically to address the modern needs of the Kokborok-speaking community, combining cultural authenticity with digital adaptability and speed.

---

## 🗂 Project Structure

```
hachukma/
├── index.html              # Main landing page
├── alphabets/              # Alphabet resources and related pages
├── downloads/              # Downloadable content (IME, fonts, etc.)
├── Font/                   # Custom Hachukma font files
├── object-image/           # Image assets
├── public/                 # Feature pages (learn, keyboard, numerals, etc.)
├── css/                    # Stylesheets
└── js/                     # Interactive scripts
```

---

## 🚀 Quick Start

To preview the site locally, simply open `index.html` in your browser.

For a local development server:

```bash
cd /path/to/hachukma
python -m http.server 8000
```

Then open `http://localhost:8000` in your browser.

---

## 🌐 Deployment

This repository is configured for **GitHub Pages**. To publish:

1. Push this repository to GitHub.
2. Go to **Settings > Pages**.
3. Select the branch (e.g., `main`) and the root folder.
4. Your site will be live at `https://hachukma.github.io/`.

Ensure `index.html` is the root entry point.

---

## 📝 Additional Notes

- The site is optimised for quick loading on desktop and mobile.
- The `public/` folder contains feature pages like `hachukma-learn.html`, `virtual-keyboard.html`, and `numerals.html`.
- The design palette uses calm teal and white tones to reflect clarity and accessibility.

---

## 📌 Contact

For questions, feedback, or collaboration, feel free to reach out via the repository issues or contact the maintainer directly.

---

**Happy typing in Hachukma!** 🏔️✍️
