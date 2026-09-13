Build the "Payment / भुगतान" desktop page using the SAME shared sidebar component 
(no variation) plus this page-specific layout:

TOP TAB SWITCHER (new element, sits right below the page header "Payment / भुगतान" and 
its subtitle "Track your payment status and details · DBT Tracking"):
- A horizontal 3-segment tab bar, full-width, rounded-full/pill container with soft shadow, 
  divided into 3 equal segments:
  1. "✓ भुगतान हो गया (Paid)" — green icon + text
  2. "⏳ प्रक्रिया में (Processing)" — green icon + text on default/inactive, 
  3. "⚠ विफल / अन्य (Failed / Other)" — icon + text
- Style: matches the reference tab image exactly — each segment has a checkmark/hourglass/
  warning icon, Hindi label bold, English label in parentheses below/beside it. The ACTIVE 
  segment gets a solid white rounded-pill background with soft shadow (elevated look), 
  while inactive segments sit flat on the light green tinted bar background with plain 
  green text/icon.
- Clicking a segment switches the entire content panel below it to that payment state — 
  this is a controlled tab component, not three separate pages.

CONTENT PANEL — switches based on active tab, using the 3-column layout shown in the 
"Paid" reference screenshot for ALL three states (structure stays identical, only colors/ 
content/status change):

TAB 1 — PAID (green theme):
- Left card: large green checkmark circle icon, "भुगतान हो गया (Paid)" heading, large 
  bold amount "₹1,11,475", bank credit info (account, IBAN-style masked number), payment 
  date, a small closing note ("Great! Your hard work has been rewarded.") with a leaf icon.
- Middle card: "Payment Details / भुगतान विवरण" — Reference ID, Crop, Quantity, Applied 
  Rate, Govt. MSP, Gross Amount, Deductions, Net Credit — each as a label/value row, Net 
  Credit emphasized in bold green.
- Right card: "Payment Journey / भुगतान यात्रा" — vertical checklist/timeline of 4 steps 
  (all checked green circles with checkmarks) each with Hindi+English label and timestamp, 
  a "Download Receipt" pill button top-right of this card, "View Receipt Slip" button at 
  the bottom.
- Background photo strip on the far right edge: warm farmer photo with italic tagline 
  overlay ("Mehnat Ka Sahi Daam"), blurred/faded into the green-tinted page background.
- Overall page tint: soft green gradient wash (#EAF5EE toward white) across the full panel 
  background.

TAB 2 — PROCESSING (amber/yellow theme):
- Same 3-column structure, recolored to amber/mustard (#D9A441 family) instead of green:
- Left card: hourglass icon (amber), "प्रक्रिया में (Processing)" heading, same amount 
  displayed, "Expected Time: Within 24 to 48 hours", "Current Status: In Clearing" with a 
  small spinner/refresh icon.
- Middle card: same Payment Details fields, but Payment Initiated/Payment Method rows 
  shown instead of a completed credit, "Current Status: Processing" badge in amber.
  "Track Live Status" pill button top-right of this card.
- Right card: same 4-step Payment Journey timeline, but step 3 shown as active/in-progress 
  (amber ring, spinning/pulsing icon) and step 4 grayed out as pending. A "Need Help? / 
  Call us if the payment takes longer than 48 hours" mini card with phone icon at the 
  bottom.
- Background tagline photo: "Aapka Daam Surakshit Hai" over a farmer-with-phone photo, 
  amber/warm-tinted page background wash.

TAB 3 — FAILED (red/coral theme):
- Same 3-column structure, recolored to red/coral:
- Left card: red warning triangle icon, "भुगतान विफल हो गया (Payment Failed / Action 
  Needed)" heading, amount shown, short explanation text ("Your payment could not be 
  processed. Please check the details below or try again."), reassurance note ("Don't 
  worry! You can try again or contact our support team.") with a leaf icon in green (kept 
  as a calm brand accent even in the failed state).
- Middle card: same Payment Details fields plus Attempted On, Failed On, Payment Method, 
  Status (red "Failed" badge), Reason ("Payment was declined by bank"). "Download Details" 
  pill button top-right.
- Right card: "What You Can Do? / आप क्या कर सकते हैं?" — a short list of recovery actions 
  with icons: Try Again (retry icon), Use a Different Method (card icon), Contact Support 
  (headset icon), each as a clickable row. Below it, a "Need Immediate Help? Call Us Now 
  (1800-XXX-XXXX)" red-bordered CTA row with phone icon.
- Background tagline photo: "Hum Saath Hain Hamesha" over a farmer photo, soft red/coral-
  tinted page background wash.

CONSISTENCY RULES ACROSS ALL 3 TABS:
- Keep the exact same card grid structure (left status card / middle details card / right 
  action-or-timeline card) and card sizing across all three states — only recolor icons, 
  badges, backgrounds, and swap the specific fields/actions relevant to that status.
- Rounded-2xl cards, soft shadows, cream/white card backgrounds regardless of tab (the 
  colored wash is a subtle full-page background tint behind the cards, not on the cards 
  themselves — cards stay light/white so text stays readable).
- Same top header row (page title, breadcrumb subtitle, state dropdown, language selector, 
  notification bell, avatar) stays fixed and unchanged across all 3 tabs — only the tab bar 
  and content panel below it change.
- Reuse the shared sidebar component exactly as already standardized — no variation on 
  this page.
- No emojis — lucide-react icons only, colored per theme (green/amber/red) as described.