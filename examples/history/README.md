# Historical source-analysis fixture

Use the fixed [metadata](fixture.json) and [written source](written-source.md). The exact scripts and synthetic responses live in [scenarios.mjs](../../scripts/scenarios.mjs). This lesson contrasts a law's stated purpose, a photographed ceremony, and a claim about public opinion.

The photograph is [President Franklin Delano Roosevelt Signs Social Security Act](https://siarchives.si.edu/collections/siris_arc_404174), Smithsonian Institution Archives, RU 95, Box 27E, Image SIA_000095_B27E_031, August 14, 1935. Photographer unknown. The archive records a dedication on the reverse from Jim Roosevelt. Copyright is **undetermined**; its page permits personal and educational use unless otherwise noted and directs commercial requests to the archive. The image is fetched into a local ignored cache, not distributed as a project asset or labeled GPL/CC0. Use [the archive's rights guidance](https://siarchives.si.edu/services/rights-and-reproductions) for other uses.

Retrieve with `node scripts/fetch-history.mjs`. The pinned SHA-256 binds the actual inspected bytes; changed downloads fail rather than silently becoming a new fixture. This path uses the delivery identifier in the archive's IIIF manifest. Network restrictions or unavailable hosting can block retrieval. No fresh search is needed for repeated conversations.

## Independent expected evidence

- **Visible:** a seated person holds a pen over papers; several people stand nearby; the photo is a black-and-white halftone reproduction. Neither the text on the papers nor everybody's political views can be read from it.
- **Archive-supported:** the catalog identifies the signing event, date, Roosevelt, and other participants. These facts come from the record; the pixels alone do not identify people or the legislation. Avoid individual identifications where catalogs conflict.
- **Written source:** the law states a purpose of federal old-age benefits. Keep the act's words distinct from an interpretation of its aims or results.
- **Interpretation:** a public ceremony may communicate official commitment, but attendance, pose, and expressions do not prove unanimous national support. Public opinion requires other evidence with appropriate coverage.

The synthetic incorrect answer asserts universal support from apparent facial expressions. Feedback must point to that inferential leap, not invent a learner motive. A later supported answer is coached. A hints-only branch first asks for an observation and waits; it must not solve the evidence-limit question in the cue. Text-only preferences remain in force. See [checks and review](../../docs/checks.md).

Inspect the retrieved photo with an image-capable tool and keep the observation in a local check record. Fixture inspection, model interpretation and personal desktop display are separate checks; see the [review criteria](../../docs/checks.md).
