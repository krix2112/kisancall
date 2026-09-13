Build the full "Register Procurement" desktop flow (4 steps) from scratch, matching the 
attached reference image exactly for the overall shell and Step 1, then extending the same 
system to Steps 2-4.

SHARED SHELL (identical across all 4 steps):
- Reuse the standard sidebar component (unchanged) and top bar (state dropdown, search, 
  language toggle, notification bell, avatar).
- Header banner: full-width rounded-2xl photo banner — warm, golden-hour farmland photo, 
  blurred + light overlay on the left where text sits. "Register Procurement" heading (bold, 
  charcoal/dark) + "Sell your produce in just a few simple steps" subheading on the left. 
  Italic handwritten-style tagline "Apni Fasal, Sahi Daam, Behtar Kal!" in green, angled/
  positioned over the photo on the right side. A small badge card overlapping the banner's 
  bottom-right ("Fair Prices / Direct Procurement / A Stronger Tomorrow") with a leaf icon, 
  light cream background, soft shadow.
- 4-step progress tracker below the banner: numbered circles (1-4) connected by a line — 
  completed/active step filled deep green, upcoming steps outlined gray — with labels 
  underneath (Crop Details, Quantity & Quality, Procurement Centre, Review & Submit).
- Below that: a "← Back" link (left), a thin progress bar, and "Step X of 4" label (right), 
  inside a white rounded-2xl card that contains the actual step content.
- Right sidebar panel (persists across all steps, content can adapt slightly per step): 
  "Why Register Procurement?" heading with leaf icon, 4 benefit rows each with a small 
  icon-tile (rounded-full light green bg) + bold title + short gray description (Get Fair 
  Market Price, Hassle-Free Process, Real-Time Updates, Support at Every Step). Below that, 
  a mustard-tinted "Tip" card with lightbulb icon and short helpful text. Below that, a 
  full-width deep-green "Next →" pill CTA button. Small "Step X of 4 · [Step Name]" caption 
  at the very bottom.

STEP 1 — CROP DETAILS:
- "What are you selling?" heading, "Select the crop you want to register" subheading, a 
  search input on the right ("Search crop e.g. Wheat, Paddy, Maize...").
- A 4-column grid of crop selection cards — each card: full-bleed real, high-quality, 
  colorful photo of the crop (wheat stalks, paddy, corn cobs, soybeans, mustard flowers, 
  chana, arhar, urad, moong, groundnut, sunflower), crop name below in bold, rounded-2xl 
  corners, soft shadow. Selected card gets a deep-green border ring + a green checkmark 
  badge top-right corner. Include a final "Other Crops" tile styled differently (light 
  green tinted background, leaf icon instead of photo, "Select if your crop is not listed").
- Use vivid, warm, appetizing crop photography — not stock-flat or dull — matching the 
  reference image's visual quality exactly.

STEP 2 — QUANTITY & QUALITY:
- "How much are you selling?" heading, subheading referencing the crop chosen in Step 1 
  with a small thumbnail photo chip next to it for continuity.
- Quantity input: large numeric field with unit toggle (Quintal/Kg) and +/- stepper pill 
  controls in deep green.
- Quality grade selector: 3 cards (Grade A/Premium, Grade B/Standard, Grade C/Fair) each 
  with a representative close-up photo of that grain quality, short description, and the 
  same green-border+checkmark selection pattern as Step 1.
- Optional moisture % input field styled consistently.
- Right panel content can include a quality-specific tip (e.g. "Higher grade gets better 
  MSP rates") replacing the generic tip.

STEP 3 — PROCUREMENT CENTRE:
- "Where do you want to sell?" heading, "Select your nearest procurement centre" subheading.
- List/grid of mandi centre cards: name, distance with pin icon, small warm photo of the 
  mandi, a queue-status pill badge (Low Wait/green, Moderate/amber, Busy/red), same 
  selection pattern (green border + checkmark).
- A "List View / Map View" toggle; map view reuses the mandi-locations map component style 
  already used elsewhere in the app.

STEP 4 — REVIEW & SUBMIT:
- "Review your details" heading, "Please confirm everything is correct before submitting" 
  subheading.
- Summary rows for each prior selection (Crop, Quantity & Quality, Procurement Centre) — 
  each with a small thumbnail photo, label, value, and an "Edit" link jumping back to that 
  step.
- Terms/declaration checkbox, then full-width "Submit Registration" pill CTA (deep green, 
  soft glow).
- Right panel swaps to a "What Happens Next?" mini vertical timeline (Registered → Token 
  Generated → Visit Centre → Payment) using the same step-icon style as the Home dashboard's 
  queue tracker.
- On submit, this should route into the existing Confirmation (token/QR) screen.

STYLE SYSTEM (apply throughout, matching brand):
- Colors: deep green #2D6A4F primary, mustard #D9A441 sparing accent, charcoal #2B2B2B 
  headings, gray #6B6B6B secondary text, cream #FDFBF5 page background, light green tint 
  #EAF5EE for soft cards/selected states/badges.
- Rounded-2xl cards (16-24px), full-pill buttons and badges, soft shadows throughout (never 
  flat/hard), subtle hover lift (-translate-y-0.5, shadow increase, 200ms ease-out) on all 
  selectable cards and buttons.
- Real, vivid, warm photography for every crop, mandi, and quality-grade visual — no generic 
  icons where a photo is more informative, exactly as demonstrated in the reference image.
- No emojis — lucide-react icons only.
- Consistent progress tracker, sidebar, and right info panel across all 4 steps — this is 
  one connected flow, not 4 disconnected pages.