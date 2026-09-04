# Learn Data Product Heuristics with Phoebe

Nine sessions that turn 32 published principle sets, holding roughly 215 principles between them, into one small review instrument for data and insights products - then run it over a product with twenty real defects. A well-trained usability reviewer finds five of them.

**Live:** https://phoebefu6.github.io/learn-data-heuristics-with-phoebe/

- `assets/heur-live.js` holds three widgets. The **review bench** renders Tideline into the page and every check queries that rendered DOM, so nothing about the catch count is scripted: the lie factor of 6.5 to 1 is computed from the drawn bar heights, the 13 distinct fills from resolved computed colours, the 64px below the fold from real overflow. The **severity matrix** rates findings on Nielsen's three factors and reorders the fix list live. The **contract validator** really parses what you type against 22 checks drawn from FAIR, DAMA and the data-product attributes.
- **The measured lens ladder:** NN/g 5, +Few 10, +Tufte 11, +IBCS 11, +Microsoft 14, +PAIR 14, +data product 17, +DataOps 19, +GQM 20. IBCS and PAIR genuinely add zero on this product, which is what overlap between good sets looks like.
- **The anti-lever:** checking all 215 principles keeps the same 20 catches, adds 12 false flags that are each true statements about the screen and none of them defects, and takes precision from 100 percent to 63.
- Running artifact: **Tideline**, a subscription-analytics product reviewed layer by layer - the decision it serves, its contract, its platform, its operating promise, its surface and interaction, and its model.
- **Every principle set carries its verification tier**, because four of the most-cited "N principles of X" enumerate nothing at their primary source (the lakehouse, decision intelligence, North Star, the AI hierarchy of needs) and four more were never numbered by their authors (Norman, Tufte, Gestalt, Kimball and Inmon). Those are taught by concept and consequence, with no invented counts.
- Full source map: `materials/official-course-map.md`

by Phoebe Fu
