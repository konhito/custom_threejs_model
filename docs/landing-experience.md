# AquaMundi landing experience

## Status

**Decision record — no homepage migration yet.**

This document replaces an unspecified request for an "immersive" home page with a testable creative and technical brief. The homepage will not be rebuilt section-by-section. It will become one scroll-led ecological journey, while retaining semantic HTML, normal links, keyboard access, localization, and a reduced-motion experience.

## The experience in one sentence

**Follow one living connection — from a flower, to the pollinator that depends on it, to the habitat corridor that lets both survive, and finally to the global archive that makes that connection visible.**

This tells visitors what AquaMundi does before asking them to explore a route, archive, book, or program.

## What it must not become

- A conventional landing page with a WebGL ornament at the top.
- A bento/card gallery of unrelated ecology features.
- A clone of National Geographic's content, imagery, source, layout, or proprietary scene work.
- An interface whose story only works with animation enabled.
- A single oversized, generated background image with text placed on top.

The reference is the **experience grammar**: a camera-led journey, changing environments, restrained interface chrome, and text that belongs to the scene.

## Audience and desired feeling

Readers, children, families, educators, and conservation-minded visitors should feel they have entered a living field record, not an online brochure. The tone is observant, hopeful, botanical, and precise — never sci-fi, luxury-tech, or generic "save the planet".

The opening should create wonder. The middle should make the work legible. The end should give a clear next action.

## Narrative route

| Beat | Visitor learns | Scene behavior | Primary destination |
| --- | --- | --- | --- |
| 1. First contact | A flower is an ecosystem, not decoration. | Dawn field; slow camera advance toward one flower. | Continue scrolling |
| 2. The pollinator | Pollinators move life between flowers. | Macro encounter; wingbeat/pollen detail appears only briefly. | `/pollinators` |
| 3. The corridor | Habitat must connect, not exist as isolated fragments. | The camera rises through meadow and cloud layers into a connected landscape. | `asociacionnahiara.org/pollinator-corridor` |
| 4. The archive | Local species and habitats belong to a global story. | The landscape opens into the globe/archive portal. | `/globe`, `/flowers`, `/living-archive` |
| 5. Field note | Conservation is observation, education, and participation. | Research image becomes an editorial field note; motion slows. | `/education`, `/guardians` |
| 6. Return | The journey ends where care starts: with a living place. | Sunset mountain retreat into footer. | Footer navigation / participation paths |

There are six intentional beats, not six interchangeable full-screen slides. Copy appears only where it advances the story; links appear only after the visitor understands why they matter.

## Visual direction

### Composition

- One fixed visual world on desktop; HTML content travels above it.
- The scene evolves from intimate to expansive: macro flower → habitat → planet.
- Foreground, middle ground, and distant atmosphere move at different rates to create real depth.
- Navigation remains quiet and readable. The interface should recede while the story is active.
- A section heading is a change in chapter, not a recurring eyebrow label.

### Color and material

Use the existing dawn-blue, meadow-green, cloud-white, flower-gold, and coral atmosphere from the landing assets. White should read as mist/light, not a large generic page background. Dark values are for depth and legibility, never a dashboard surface.

Texture should come from photographic detail, light, pollen, mist, and restrained grain. Avoid decorative gradients, glass cards, large round containers, and repeated soft shadows.

### Type and copy

- Display copy: short, calm, concrete, scene-led.
- Body copy: one idea per beat; target 45–65 characters per line.
- Labels identify real things (species, habitat, observation), never generic marketing categories.
- All new visible copy must be localized through the existing message files before launch.

## Existing asset register

No new generated imagery is needed for the prototype. Confirm final ownership/license before release; do not assume an asset is cleared merely because it is in `public/`.

| Asset | Intended use | Constraint |
| --- | --- | --- |
| `landing/living-field-hero.png` | Opening dawn field and initial camera direction. | Treat as a backdrop plate, never crop into a card. |
| `landing/carnation-pollinator.webp` | Close pollinator encounter. | One short narrative beat, not repeated decoration. |
| `landing/pollinator-meadow.webp` | Corridor/habitat transition. | Use as a wide environment, not a small tile. |
| `landing/lotus-wetland.webp` | Alternate aquatic habitat moment or archive preview. | Only if it supports the route's story. |
| `landing/cloud-bank-*-alpha.webp` | Depth planes for cloud passage. | Use alpha versions for layered parallax. |
| `landing/field-observation.png` | Evidence and field-note beat. | Supports a specific observation, not a generic About panel. |
| `landing/archive-mountain-footer.png` | Final retreat into footer. | Retain as the closing scene. |
| `pollinators/*.jpg` and wingbeat GIFs | Optional species annotation / micro-motion. | Use one at a time; no GIF wall. |
| Existing globe and country data | Archive portal. | The globe must be part of the journey, not boxed inside a neutral container. |

## Technical model

### Scroll and animation authority

The current global `SmoothScroll` component already creates one native Lenis instance with anchors, `autoRaf`, `lerp: 0.1`, nested-scroll prevention, and route scroll reset. Keep that implementation for the prototype.

For the first prototype, subscribe to its Lenis scroll state and write progress/velocity into refs consumed by the canvas. Do **not** introduce a second Lenis provider, a second smooth-scroll library, or a transformed page wrapper.

If the later build needs GSAP ScrollTrigger, change to a single GSAP-driven Lenis ticker (`autoRaf: false`) rather than running both clocks. The decision is made when the prototype proves which scenes need timeline sequencing.

### Scene architecture

```text
Normal document scroll (semantic sections, links, localized copy)
                    ↓ Lenis progress + velocity
Fixed R3F / Three scene (camera, layers, atmosphere)
                    ↓ scene progress
HTML scene markers (text, labels, CTAs, accessibility equivalents)
```

- The canvas is `aria-hidden`; all meaning, controls, and destinations remain in HTML.
- Scene values are stored in refs rather than React state on every scroll frame.
- Use a single canvas mounted for the journey, not one canvas per section.
- Load a low-cost opening state first; lazily load heavier scene materials after the initial interaction.
- Preserve the existing globe implementation until it is deliberately integrated as a route/scene, not copied into another renderer.

### Responsive and accessible fallback

| Context | Behavior |
| --- | --- |
| Desktop / capable GPU | Fixed scene, camera path, layered atmosphere, subtle pointer response. |
| Mobile / touch | Native document scroll; static or cross-faded scene plates; no `syncTouch`. |
| `prefers-reduced-motion` | No camera travel or parallax; scene changes use immediate/static states while HTML narrative stays complete. |
| Low-memory or WebGL unavailable | Regular editorial document using the same images, headings, and links. |

Lenis already honors reduced motion by default. Canvas code must honor the same preference rather than merely leaving Lenis to do so.

## Prototype: the only thing to build next

### Scope

Build a hidden development route, not `/`:

1. A fixed canvas with the dawn-field plate.
2. Three depth layers: distant field, flower/pollinator, and cloud alpha layer.
3. One 30–40 second scroll span with a camera advance and a cloud transition.
4. Three semantic HTML markers: opening sentence, pollinator fact, corridor CTA.
5. Static/reduced-motion fallback using those same markers and images.

### Acceptance criteria

- It feels like movement through one place, not three images fading in.
- Text stays readable and never blocks the primary subject for the whole sequence.
- Scrolling remains native; anchors, keyboard navigation, and the existing chat/modal prevention still work.
- No duplicate Lenis loop, console errors, or new runtime dependency.
- Mobile is intentional rather than a compressed desktop scene.
- The prototype is reviewed visually before any homepage replacement.

## Implementation phases

1. **Asset and copy lock** — verify licenses/ownership, choose final three prototype plates, write localized prototype copy.
2. **Prototype route** — prove the visual system and scroll/camera relationship in isolation.
3. **Creative review** — decide whether the scene language is strong enough to replace the current home.
4. **Journey build** — add corridor, archive portal, field-note, and closing scene.
5. **Integration** — replace the current homepage sequence, preserving existing destinations and site-wide behavior.
6. **Quality pass** — test desktop, mobile, reduced motion, no-WebGL, keyboard, localization, performance, and build output.

## References used for principles, not copying

- Lenis documentation: native scrolling, a single animation loop, WebGL/DOM synchronization, reduced motion, and nested-scroll handling.
- National Geographic *Into the Amazon*: reference for narrative camera movement and the relationship between scene and HTML text; no assets, graphics, footage, code, or layout will be copied.
- Award-winning interactive editorial work: reference for using WebGL to tell a story rather than decorating a conventional page.
