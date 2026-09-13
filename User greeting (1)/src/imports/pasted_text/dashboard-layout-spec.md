Recreate this exact desktop web dashboard layout (KisanCall — farmer procurement platform) 
pixel-matching the attached reference screenshot. Do not redesign or reinterpret — replicate 
structure, spacing, and hierarchy exactly.

LAYOUT:
- Left sidebar (fixed, ~220px wide, cream/off-white bg #FDFBF5): logo "KisanCall" with leaf icon 
  + tagline "Your Farm. Our Support." at top, nav items with lucide icons (Home, My Requests, 
  Market Prices, Payment, Slips/Records, Calls, Profile) stacked vertically, active item 
  (Home) shown with a green left border indicator + light green tint background (#EAF5EE). 
  Bottom of sidebar: a "Need Help?" card with headset icon, toll-free number in a pill button 
  (deep green #2D6A4F, full-pill radius), soft glow on the button. Below that, a faint 
  illustration of tractor/farmland silhouette at the very bottom edge.

- Top bar: search input (rounded-full, light gray bg, magnifying glass icon + placeholder 
  "Search for mandis, services, or help..."), right-aligned: language selector "EN" with 
  chevron, notification bell icon with red dot badge, user avatar circle (initials "RK") 
  with name "Ramesh Kumar" / role "Farmer" and a chevron.

- Hero banner (full width, rounded-2xl corners ~20px, soft shadow): background is a warm 
  golden-hour farm field photo. IMPORTANT: apply a soft blur (backdrop-blur or blurred 
  duplicate layer) and a white/cream gradient overlay with high opacity (60-75%) on the 
  LEFT side where text sits, fading to more visible photo on the right — so "Good Morning, 
  Ramesh Kumar" (large bold charcoal heading) and location pin "Rampur, Uttar Pradesh" stay 
  fully legible against the photo. On the right side of the banner, include a small 
  speech-bubble-style card containing the italic handwritten-style Hindi/Hinglish tagline 
  "Sahi jaankari, behtar fasal" with a small plant/sprout icon.
  Use the attached farmer photo (turban, thumbs-up, green field, golden light) as the 
  hero background reference for tone/mood — blurred + overlaid the same way, swap in on 
  other banners across the app for consistency.

- Below hero, 2-column grid of cards (rounded-2xl, soft drop shadow, white/cream bg):
  1. "Your Queue Status" card — green "Live" pill badge, large circular progress ring 
     showing "12 Your Turn", estimated time "~45 minutes", mandi name + crop/date subtext, 
     horizontal stepper below (Registered → At Mandi → Verification → Payment) with filled 
     green circles for completed steps.
  2. "Mandi Map & Queue" card — green "Live Location" pill, mini map preview with pin 
     markers for nearby mandis and distances, "View Full Map" button (pill, green).
  
  Second row, 2-column:
  3. "Procurement Details" card — orange "Pending" pill badge, quantity/price/quality rows, 
     small wheat/grain photo on the right edge with soft fade.
  4. "Payment Status" card — orange "Pending" pill, amount/reference/updated rows, coin/rupee 
     icon photo on right edge, small amber info banner at bottom ("Payment will be processed 
     after verification...").

- "Kisan Digital Services" section: label + "X Services Active" counter top-right, row of 
  5 small square icon-tile cards (rounded-xl, light tinted backgrounds in green/blue/purple/
  pink/gray, each with a lucide icon + label + sublabel + chevron): Mandi Price, Payment 
  Status, Procurement, Call History, KYC & Settings.

- Bottom-width banner: "Talk to Our AI Voice Assistant" — dark green gradient/solid card, 
  bot avatar icon on left, heading + description text, two pill CTA buttons ("Talk to AI Now" 
  with mic icon — mustard/white, "Call 1800-XXX-XXXX" with phone icon — outlined), decorative 
  bot illustration + speech bubble ("Aapka sawal, hamari madad") on the right side over a 
  blurred soft farm-field photo background.

STYLE SYSTEM (apply throughout):
- Colors: primary deep green #2D6A4F, accent mustard #D9A441 (sparing use — CTAs/highlights 
  only), charcoal #2B2B2B for headings, gray #6B6B6B for secondary text, cream #FDFBF5 
  background, light green tint #EAF5EE for soft card/badge backgrounds.
- Corners: 16-24px radius on cards, full pill radius on all buttons.
- Shadows: soft, never flat — subtle multi-layer drop shadows on cards, slightly stronger 
  glow shadow on primary green CTAs and on "Live" status badges (soft green glow ring).
- No emojis anywhere — lucide-react icon set only, consistent stroke width.
- Real photography (not icons/illustrations) for crops, mandis, and farmer imagery — warm, 
  golden-hour, authentic feel, never stiff stock-photo posing. Use blur + light overlay 
  wherever photos sit behind text to preserve readability, matching the hero banner treatment.
- Occasional italic handwritten-style Hindi/Hinglish accent taglines used sparingly as 
  decorative flourishes near hero/CTA sections only — not on every card.

Keep all existing mobile screen content/components untouched — this is a desktop-only sidebar 
shell reflow of the same data, not a new design.