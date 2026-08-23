insert into settings (id, site_url, cms_type, publish_mode, frequency_days, autopilot_on, onboarded, language_pref)
values (1, 'https://smartmount.ca', 'wordpress', 'approve', 1, false, false, 'en')
on conflict (id) do nothing;

insert into brand_profile (
  id, voice_summary, services, service_areas, differentiators, pricing_notes, testimonials, cta_language
) values (
  1,
  'Professional, reliable, fast, transparent. Local Ottawa pride. Zero hype. Safety-focused. Speaks like a trusted local expert who shows up on time and leaves the place cleaner than he found it.',
  '["TV wall mounting (flush, tilt, full-motion)","Samsung Frame installs","Above-fireplace mounting","Cable management (slim cover or in-wall)","Soundbar mounting","Monitor arms","Commercial screens","Ikea assembly"]'::jsonb,
  '["Ottawa","Gatineau","Kanata","Nepean","Barrhaven","Orléans","Stittsville","Aylmer","Hull","Westboro","Centretown","The Glebe","Vanier","Riverside South","Manotick","Greely"]'::jsonb,
  '["Book now, mounted today","Fully insured + 1-year workmanship warranty","Exact upfront pricing, taxes included","Price-match any written quote","600+ TVs mounted, 4.8 Google","Bolted into solid wood studs"]'::jsonb,
  'TV mounting priced in the live build-your-install tool (taxes included). $25 locks the day. Slim cover $45, in-wall $219. Monitor labour from $125. Price-match any written quote from a registered business.',
  '[{"author":"Mikaela Z.","quote":"Television and sound bar mounted today with cable management. Professional and knowledgeable."},{"author":"Patrick Y.","quote":"Sam called before he arrived, left the work area clean, hung our TV and assembled Ikea furniture."}]'::jsonb,
  'See your exact price and book at smartmount.ca — or chat if you would rather ask first.'
)
on conflict (id) do nothing;

insert into keywords (keyword, category, intent, suburb, language, volume_score, competition_score, conversion_score, opportunity_score, status, paa_questions) values
('TV mounting Ottawa', 'core', 'transactional', 'Ottawa', 'en', 92, 62, 88, 74, 'queued', '["How much does TV mounting cost in Ottawa?","Can you mount a TV the same day?"]'::jsonb),
('TV wall mount Ottawa', 'core', 'transactional', 'Ottawa', 'en', 80, 58, 84, 71, 'queued', '[]'::jsonb),
('same day TV mounting Ottawa', 'core', 'transactional', 'Ottawa', 'en', 64, 28, 96, 80, 'queued', '["Do I need to buy the mount first?"]'::jsonb),
('TV mounting Gatineau', 'core', 'transactional', 'Gatineau', 'en', 70, 34, 90, 78, 'queued', '[]'::jsonb),
('installation tele Gatineau', 'core', 'transactional', 'Gatineau', 'fr', 58, 22, 88, 78, 'queued', '["Quel est le prix pour installer un téléviseur à Gatineau?"]'::jsonb),
('TV mounting Kanata', 'neighborhood', 'transactional', 'Kanata', 'en', 72, 30, 94, 81, 'published', '["Do you cover Kanata Lakes and Morgan''s Grant?"]'::jsonb),
('TV wall mount Kanata', 'neighborhood', 'transactional', 'Kanata', 'en', 55, 24, 90, 78, 'queued', '[]'::jsonb),
('TV mounting Barrhaven', 'neighborhood', 'transactional', 'Barrhaven', 'en', 61, 22, 92, 80, 'queued', '[]'::jsonb),
('TV mounting Nepean', 'neighborhood', 'transactional', 'Nepean', 'en', 54, 26, 88, 76, 'queued', '[]'::jsonb),
('TV mounting Orleans', 'neighborhood', 'transactional', 'Orléans', 'en', 58, 25, 90, 78, 'queued', '[]'::jsonb),
('TV mounting Stittsville', 'neighborhood', 'transactional', 'Stittsville', 'en', 48, 18, 91, 79, 'queued', '[]'::jsonb),
('TV mounting Aylmer', 'neighborhood', 'transactional', 'Aylmer', 'en', 40, 14, 86, 76, 'queued', '[]'::jsonb),
('TV mounting Hull', 'neighborhood', 'transactional', 'Hull', 'en', 42, 16, 85, 75, 'queued', '[]'::jsonb),
('TV mounting Westboro', 'neighborhood', 'transactional', 'Westboro', 'en', 44, 20, 87, 75, 'queued', '[]'::jsonb),
('TV mounting The Glebe', 'neighborhood', 'transactional', 'The Glebe', 'en', 38, 18, 84, 73, 'queued', '[]'::jsonb),
('TV mounting Centretown', 'neighborhood', 'transactional', 'Centretown', 'en', 46, 28, 86, 72, 'queued', '[]'::jsonb),
('TV mounting Manotick', 'neighborhood', 'transactional', 'Manotick', 'en', 32, 12, 82, 73, 'queued', '[]'::jsonb),
('TV mounting Riverside South', 'neighborhood', 'transactional', 'Riverside South', 'en', 36, 15, 88, 76, 'queued', '[]'::jsonb),
('TV mounting near me Ottawa', 'neighborhood', 'transactional', 'Ottawa', 'en', 84, 70, 80, 65, 'queued', '[]'::jsonb),
('how much does TV mounting cost Ottawa', 'intent', 'commercial', 'Ottawa', 'en', 78, 36, 95, 82, 'published', '["Is the mount included?","Do you charge extra for brick or concrete?"]'::jsonb),
('mount TV above fireplace Ottawa', 'intent', 'transactional', 'Ottawa', 'en', 66, 32, 93, 79, 'review', '["Is it safe above a gas fireplace?"]'::jsonb),
('hide TV wires Ottawa', 'intent', 'transactional', 'Ottawa', 'en', 60, 24, 90, 79, 'published', '["In-wall vs raceway?","Is in-wall allowed in a condo?"]'::jsonb),
('Samsung Frame TV install Ottawa', 'intent', 'transactional', 'Ottawa', 'en', 52, 20, 94, 81, 'queued', '["Do you recess the One Connect box?"]'::jsonb),
('in wall cable concealment Ottawa', 'intent', 'transactional', 'Ottawa', 'en', 48, 18, 89, 78, 'queued', '[]'::jsonb),
('full motion TV mount install Ottawa', 'intent', 'transactional', 'Ottawa', 'en', 50, 27, 88, 75, 'queued', '[]'::jsonb),
('75 inch TV wall mount Ottawa', 'intent', 'transactional', 'Ottawa', 'en', 47, 29, 90, 75, 'queued', '[]'::jsonb),
('soundbar mounting Ottawa', 'intent', 'transactional', 'Ottawa', 'en', 41, 19, 84, 74, 'queued', '[]'::jsonb),
('office TV mounting Ottawa', 'commercial', 'commercial', 'Ottawa', 'en', 49, 21, 86, 76, 'queued', '["Do you install after hours?"]'::jsonb),
('restaurant screen install Gatineau', 'commercial', 'commercial', 'Gatineau', 'en', 38, 14, 88, 77, 'queued', '[]'::jsonb),
('gym TV installation Ottawa', 'commercial', 'commercial', 'Ottawa', 'en', 34, 16, 85, 74, 'queued', '[]'::jsonb),
('boardroom TV install Ottawa', 'commercial', 'commercial', 'Ottawa', 'en', 40, 18, 87, 76, 'queued', '[]'::jsonb),
('digital menu board install Ottawa', 'commercial', 'commercial', 'Ottawa', 'en', 36, 15, 90, 78, 'queued', '[]'::jsonb),
('Super Bowl TV mounting Ottawa', 'seasonal', 'transactional', 'Ottawa', 'en', 44, 22, 92, 77, 'queued', '[]'::jsonb),
('new condo TV mounting Ottawa', 'seasonal', 'transactional', 'Ottawa', 'en', 50, 26, 91, 77, 'queued', '[]'::jsonb),
('can you mount a TV on brick Ottawa', 'paa', 'informational', 'Ottawa', 'en', 33, 12, 80, 72, 'queued', '[]'::jsonb),
('how long does TV mounting take Ottawa', 'paa', 'informational', 'Ottawa', 'en', 37, 14, 78, 71, 'queued', '[]'::jsonb)
on conflict (keyword) do nothing;

insert into articles (
  keyword_id, title, slug, language, status, meta_title, meta_description, h1, outline, body_markdown, faq, internal_links, word_count, scheduled_for, published_at, impressions, clicks, avg_position, estimated_bookings
)
select
  k.id,
  'How much does TV mounting cost in Ottawa in 2026?',
  'tv-mounting-cost-ottawa',
  'en',
  'published',
  'TV mounting cost Ottawa 2026 | Smart Mount',
  'Real Ottawa TV mounting prices: what changes the number, what is included, and how to lock a same-day slot without haggling.',
  'How much does TV mounting cost in Ottawa?',
  '[{"h2":"What you are actually paying for","bullets":["Labour, mount type, cable work"]},{"h2":"What changes the price","bullets":["Size, wall, fireplace, in-wall"]},{"h2":"How to get the exact number","bullets":["Build-your-install tool"]}]'::jsonb,
  $md1$If you are searching "how much does TV mounting cost Ottawa," you want a number, not a discovery call. Fair. At Smart Mount you see the exact price — taxes included — before anyone books a truck.

The short version: labour is the job, the mount is whatever you already bought or want us to supply, and cable work is optional. A $25 deposit locks the day. The rest is due when the TV is on the wall and the floor is swept.

## What you are actually paying for

A proper install is not two screws and a hope. We find the studs, set the height to your eye line from the couch, bolt into solid wood, level the screen, and manage the cords so the wall does not look like a server closet.

Three mount types cover almost every Ottawa living room:

- **Flush** — thinnest profile. Best on a clean wall with no fireplace.
- **Tilt** — a few degrees down. Useful when the TV sits a little high.
- **Full-motion** — pulls out and swivels. Common in condos that share a room, and over some fireplaces.

## What changes the price

Size matters less than people think. A 75-inch is heavier and needs a rated mount and real studs, but the process is the same. What actually moves the number:

- **Cable hiding.** Slim cover is $45. In-wall is $219, done to code.
- **Fireplace.** Heat, mantel depth, and a brick or stone surround add planning. We still do these all week.
- **Wall type.** Drywall over wood studs is standard. Brick, block, and concrete are normal in older Centretown and Glebe homes — we come with the right anchors.
- **Soundbar.** Same visit, same invoice.

Monitor arms and ultrawides are a separate, published labour scale (from $125). Commercial jobs — restaurants, gyms, boardrooms — get a written quote, often with after-hours labour so you do not lose a shift.

## Same-day, not "we will call you"

Book now, mounted today. Not next week. If the calendar shows an opening, that slot is real. Sam calls before arrival. You do not need to empty the room. You do need a clear wall and the TV in the house.

We are fully insured. Every job carries a 1-year workmanship warranty. If you already have a written quote from a registered business, we beat it.

## How to get your number

Use the build-your-install tool on smartmount.ca. A few taps, taxes included, $25 to lock the day. If you would rather ask first — brick wall, Frame TV, or a restaurant row of screens — chat. That is faster than a form.

Ottawa, Gatineau, and the suburbs (Kanata, Barrhaven, Orléans, Stittsville, Aylmer, Hull) are all on the same truck.

See your exact price and book at [smartmount.ca](https://smartmount.ca).$md1$,
  '[{"q":"Is the mount included in the price?","a":"Labour is quoted separately from hardware. Bring your mount or we can supply one rated for the TV."},{"q":"Do you charge extra for brick or concrete?","a":"Brick, block, and concrete are routine in Ottawa. The live price tool and chat will flag anything unusual before we book."},{"q":"Can I get a same-day install?","a":"Yes. If the calendar has an opening, we mount today. $25 holds the slot."}]'::jsonb,
  '[{"text":"Book now, mounted today","href":"https://smartmount.ca"},{"text":"Commercial quote","href":"https://smartmount.ca/commercial.html"}]'::jsonb,
  620,
  current_date - 18,
  now() - interval '18 days',
  1840,
  126,
  6.4,
  4.4
from keywords k where k.keyword = 'how much does TV mounting cost Ottawa'
on conflict (slug) do nothing;

insert into articles (
  keyword_id, title, slug, language, status, meta_title, meta_description, h1, outline, body_markdown, faq, internal_links, word_count, scheduled_for, published_at, impressions, clicks, avg_position, estimated_bookings
)
select
  k.id,
  'Same-day TV wall mounting in Kanata: what to expect',
  'same-day-tv-mounting-kanata',
  'en',
  'published',
  'Same-day TV mounting Kanata | Smart Mount',
  'Kanata TV wall mounting the same day you book. Studs, height, cable hiding, and a clean living room when we leave.',
  'Same-day TV wall mounting in Kanata',
  '[{"h2":"The visit, start to finish","bullets":["Call ahead","Studs and height","Cables"]},{"h2":"Kanata walls we see most","bullets":["New builds","Condos"]}]'::jsonb,
  $md2$Kanata books a lot of same-day mounts. New builds in Kanata Lakes, Morgan's Grant, and around the Centrum mean a TV that still sits on the floor two days after move-in. Smart Mount is built for that: book now, mounted today.

This is not a marketplace handyman. One insured local crew, one price before we leave the shop, one-year workmanship warranty.

## The visit, start to finish

You pick a slot on smartmount.ca. $25 holds it. Sam calls before he arrives so you are not waiting with the dog in the hall.

On site we:

1. Confirm the viewing seat — the middle of the screen lines up with your eyes from where you actually sit.
2. Find the studs. The mount is bolted into solid wood, not drywall anchors dressed up as "heavy duty."
3. Hang, level, torque. Flush, tilt, or full-motion, whatever you chose.
4. Hide the cords if you asked: slim cover ($45) or in-wall ($219).
5. Sweep. The living room should look better than when we walked in.

Most single-TV jobs are done in a normal afternoon window. You do not need to pull furniture across the room unless the wall is blocked.

## Kanata walls we see most

New construction is friendly: wood studs, predictable centres, often a wired outlet already in the TV wall. Condos around Terry Fox and the Town Centre sometimes want in-wall concealment — we do that to code, and we will tell you if a particular stack does not allow it.

Brick feature walls and fireplaces happen too. Those are planned, not guessed. If heat or a mantel is in play, say so in chat before you book so the mount type is right.

## Pricing, without the runaround

Exact upfront pricing, taxes included. Price-match any written quote from a registered business. No hourly surprises at the door.

Kanata, Stittsville, and west Nepean are regular stops, not "travel fees." If you are in Beaverbrook at 2 and still want it on the wall tonight, check the calendar.

Book at [smartmount.ca](https://smartmount.ca) or chat first if the wall is unusual.$md2$,
  '[{"q":"Do you cover Kanata Lakes and Morgan''s Grant?","a":"Yes. Kanata and Stittsville are regular same-day coverage, including the new-build pockets."},{"q":"Do I need to buy the mount first?","a":"You can. Or we can supply a mount rated for your TV. Either way the labour price is clear before we roll."},{"q":"Will you hide the wires?","a":"Yes. Slim cover is $45. In-wall is $219. Skip it if the outlet is already behind the TV."}]'::jsonb,
  '[{"text":"See your price","href":"https://smartmount.ca"}]'::jsonb,
  540,
  current_date - 11,
  now() - interval '11 days',
  960,
  74,
  9.1,
  2.6
from keywords k where k.keyword = 'TV mounting Kanata'
on conflict (slug) do nothing;

insert into articles (
  keyword_id, title, slug, language, status, meta_title, meta_description, h1, outline, body_markdown, faq, internal_links, word_count, scheduled_for, published_at, impressions, clicks, avg_position, estimated_bookings
)
select
  k.id,
  'How to hide TV wires in an Ottawa condo (without wrecking the wall)',
  'hide-tv-wires-ottawa-condo',
  'en',
  'published',
  'Hide TV wires Ottawa condo | Smart Mount',
  'Slim cover or in-wall: the two clean ways to hide TV cables in Ottawa and Gatineau condos, with real prices and what boards usually allow.',
  'How to hide TV wires in an Ottawa condo',
  '[{"h2":"Two clean options","bullets":["Slim cover","In-wall"]},{"h2":"What condos usually allow","bullets":["Code","Board rules"]}]'::jsonb,
  $md3$A TV on the wall with a black waterfall of HDMI hanging off it is not "done." Ottawa condos — Centretown, Westboro, Gatineau riverfront, new stacks in Kanata — all have the same problem: the outlet is never quite where the screen wants to live.

Smart Mount does two clean fixes. Both are priced. Neither involves a painter you have to call later.

## Option 1: slim cover — $45

A low-profile raceway, painted or already close to the wall colour, that takes power and HDMI down to the cabinet. Fast, reversible, and friendly to rental agreements and condo bylaws that hate holes.

This is the right call when:

- You are renting.
- The board is strict about in-wall electrical.
- You want it hidden today, not after an electrician.

It is not invisible. It is tidy. From the couch, most people stop seeing it.

## Option 2: in-wall — $219

We fish the cables inside the wall and put a low-voltage opening behind the TV and at the component shelf. Power is handled to code. This is the flush, "how did they do that" finish you see in listings.

In-wall is the right call when:

- You own the unit.
- There is a stud bay we can actually use.
- You want a Frame TV or a flush mount with nothing on the paint.

We will tell you on site if a fire block, concrete, or a party wall makes in-wall the wrong idea. We do not punch and pray.

## What condo boards usually allow

Low-voltage in-wall (HDMI, ethernet) is routinely fine. Tapping a new electrical outlet is a different conversation. If your unit needs a new receptacle, we flag it before we start so you are not surprised.

Brick and concrete towers in the ByWard and Hull need different hardware. That is normal work for us, not a change order.

## Book it with the mount

Hiding wires on a later visit means paying for two trips and living with the mess in between. Add slim cover or in-wall when you book the mount. Same-day is available.

See the exact total — mount labour plus cable work, taxes included — at [smartmount.ca](https://smartmount.ca).$md3$,
  '[{"q":"In-wall vs raceway?","a":"Raceway (slim cover) is $45, reversible, rental-friendly. In-wall is $219 and the cleaner finish if the wall and the board allow it."},{"q":"Is in-wall allowed in a condo?","a":"Low-voltage concealment usually is. New power outlets may need approval. We will say which job you have before we cut."},{"q":"Can you hide wires for a Frame TV?","a":"Yes. Frame installs look wrong with visible cables. We plan the One Connect path as part of the visit."}]'::jsonb,
  '[{"text":"Build your install","href":"https://smartmount.ca"}]'::jsonb,
  510,
  current_date - 6,
  now() - interval '6 days',
  720,
  61,
  11.8,
  2.1
from keywords k where k.keyword = 'hide TV wires Ottawa'
on conflict (slug) do nothing;

insert into articles (
  keyword_id, title, slug, language, status, meta_title, meta_description, h1, outline, body_markdown, faq, internal_links, word_count, scheduled_for, impressions, clicks, avg_position
)
select
  k.id,
  'Mounting a TV above a fireplace in Ottawa — when it is a good idea',
  'mount-tv-above-fireplace-ottawa',
  'en',
  'review',
  'Mount TV above fireplace Ottawa | Smart Mount',
  'When an above-fireplace TV works in Ottawa homes, when it does not, and how we set height, heat, and cables without guesswork.',
  'Mounting a TV above a fireplace in Ottawa',
  '[{"h2":"Heat and height","bullets":["Gas vs wood","Eye line"]},{"h2":"The wall behind the mantel","bullets":["Brick","Drywall chase"]}]'::jsonb,
  $md4$Plenty of Ottawa living rooms put the fireplace on the only wall that makes sense for a TV. That can work. It can also give you a sore neck and a screen that dies young. The difference is planning, not luck.

Smart Mount hangs TVs above fireplaces every week — gas inserts in Barrhaven new builds, older brick in the Glebe, linear units in Westboro condos. We will also tell you when the mantel is the wrong home for a 75-inch.

## Heat first

A TV has a listed operating temperature. A wood fire that roasts the masonry is a different world from a sealed gas insert on low. If you can hold your hand on the wall at screen height while the fireplace runs, we are usually in range. If you cannot, we look at a pull-down full-motion mount, a mantel shelf that sheds heat, or we recommend a different wall.

We do not guess. If the job is a bad idea, you hear that before the $25 is more than a hold.

## Height, from the couch

We line up the middle of the screen with your eyes from where you sit. Above a mantel that often means a tilt or a full-motion arm so you are not watching the ceiling. Comfortable to watch, no sore neck, no "we will see how it feels."

## The wall behind the mantel

Brick and stone need the right anchors. Drywall with a chase can take in-wall cable concealment ($219) so power and HDMI disappear into the cabinet. Slim cover ($45) is the reversible option.

Same-day is available when the opening is on the calendar. Fully insured, 1-year workmanship warranty, exact price before we leave the shop.

If this is your wall, book at [smartmount.ca](https://smartmount.ca) or chat with a photo of the fireplace. A photo saves a wasted visit.$md4$,
  '[{"q":"Is it safe above a gas fireplace?","a":"Often yes, if the wall at screen height stays within the TV''s temperature range. We check that rather than assuming."},{"q":"Will I have to look up?","a":"Not if we set height from your seat and use tilt or full-motion when the mantel is high."}]'::jsonb,
  '[{"text":"Book the fireplace wall","href":"https://smartmount.ca"}]'::jsonb,
  430,
  current_date + 1,
  0,
  0,
  null
from keywords k where k.keyword = 'mount TV above fireplace Ottawa'
on conflict (slug) do nothing;

update keywords set status = 'published' where keyword in (
  'how much does TV mounting cost Ottawa',
  'TV mounting Kanata',
  'hide TV wires Ottawa'
);
update keywords set status = 'writing' where keyword = 'mount TV above fireplace Ottawa';

insert into metrics_daily (day, impressions, clicks, avg_position, ctr, estimated_bookings)
select
  (current_date - (60 - n))::date as day,
  (380 + n * 26 + (n % 9) * 28)::int as impressions,
  (11 + n + (n % 6) * 2)::int as clicks,
  round((26.4 - n * 0.28 + (n % 4) * 0.12)::numeric, 1) as avg_position,
  round(((11 + n + (n % 6) * 2)::numeric) / (380 + n * 26 + (n % 9) * 28), 4) as ctr,
  round(((11 + n + (n % 6) * 2) * 0.038)::numeric, 2) as estimated_bookings
from generate_series(1, 60) as n
on conflict (day) do nothing;

insert into competitors (name, url, notes, threat, overlapping_keywords, last_seen) values
('Best Buy / Geek Squad', 'https://www.bestbuy.ca', 'National install add-on. Slow slots, not same-day local. Weak on fireplace and in-wall.', 'medium', 14, 'Ranks for generic “TV mounting Ottawa”.'),
('Task-app handymen', null, 'Variable insurance, no warranty, price drift at the door. Beat them on trust pages.', 'medium', 9, 'Shows up in “near me” packs.'),
('Facebook Marketplace installers', null, 'Cheap, uninsured, no paper trail. Content should keep repeating insured + warranty.', 'low', 6, 'Not a SERP threat; a conversion objection.'),
('Regional mount shops', null, 'A few Ottawa/Gatineau names competing on “TV installer.” Thin neighborhood pages.', 'high', 18, 'Almost no Kanata/Barrhaven/Orléans landing content.'),
('Furniture / big-box delivery', null, 'Hang-over-the-fireplace often refused. Easy gap to own.', 'low', 4, 'Won''t do brick or in-wall.');

insert into gbp_posts (title, body, cta, status, scheduled_for) values
('Openings today — Ottawa & Gatineau',
 'Same-day TV wall mounting is on the calendar. Exact price before we roll, $25 to hold the slot, bolted into real studs, 1-year workmanship warranty. Kanata, Barrhaven, Orléans, Hull, and in between.',
 'Book now', 'suggested', current_date),
('Kanata new builds, TVs off the floor',
 'Moved into Kanata Lakes or Morgan''s Grant and the 65-inch is still leaning on the wall? We mount today: eye-level from the couch, cables hidden if you want them gone, floor swept on the way out.',
 'See your price', 'suggested', current_date + 2),
('Restaurants and gyms — after hours',
 'Menu boards, cardio rows, boardroom screens. One written quote, one invoice, install after you close so you do not lose a shift. Fully insured. Volume pricing when we hang more than one.',
 'Request a quote', 'suggested', current_date + 4),
('Fireplace season in Ottawa',
 'Hanging above a gas insert is a planning job, not a guess. We check heat, set height from your seat, and hide the cords. If the mantel is the wrong wall, we will say so before we drill.',
 'Chat a photo', 'suggested', current_date + 6);

insert into activity_log (kind, message, created_at) values
('publish', 'Published “How much does TV mounting cost in Ottawa in 2026?”', now() - interval '18 days'),
('publish', 'Published “Same-day TV wall mounting in Kanata”', now() - interval '11 days'),
('publish', 'Published “How to hide TV wires in an Ottawa condo”', now() - interval '6 days'),
('generate', 'Draft ready for review: fireplace mounting', now() - interval '1 day'),
('keyword', 'Neighborhood cluster loaded — 12 Ottawa-Gatineau suburbs', now() - interval '20 days');
