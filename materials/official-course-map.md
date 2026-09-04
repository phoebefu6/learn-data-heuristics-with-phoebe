# Official course map - Data Product Heuristics

Nine sessions, 45 minutes each. Running artifact: **Tideline**, a subscription-analytics
product carrying twenty real defects. Each session adds one layer's lens to a review
instrument; session 9 runs the finished instrument.

Research pass completed 2026-09-04. **Every principle set below carries its verification
tier**, because four of the most-cited "N principles of X" have no such list at their primary
source, and three more are real but access-gated. Teaching a count that was never published is
citing a fabrication, so the tiers are content on the pages, not just bookkeeping here.

## Verification tiers used throughout

| Tier | Meaning |
|------|---------|
| **PRIMARY** | Fetched and read from the authoritative source. Quote counts and wording precisely. |
| **SECONDARY** | The set is real but its primary source is paywalled or not machine-readable. Cite the source, say the wording travels through a close secondary. |
| **BOOK-ONLY** | Genuinely foundational, never published by its author as a numbered list. Teach by concept and consequence. Never give a count. |
| **NO LIST** | Widely cited as a numbered principle set. The primary source enumerates nothing. Give no count and say so. |

## Coverage by session

Legend: ✓ taught in full · ◐ named and partially taught, full depth in self-study or another session

### Session 1 - The canon and the instrument
| Source | Tier | Cover |
|---|---|---|
| Nielsen, 10 Usability Heuristics (1994, rev. 2020) - https://www.nngroup.com/articles/ten-usability-heuristics/ | PRIMARY | ✓ all ten, current wording |
| Nielsen, Severity Ratings for Usability Problems | PRIMARY | ✓ frequency, impact, persistence on a 0-4 scale |
| Nielsen and Molich, Heuristic Evaluation of User Interfaces (1990) | PRIMARY | ◐ the independent-then-pooled method named; evaluator arithmetic is self-study |
| The remaining 31 sets | mixed | ◐ mapped by family and tier; each taught in the session that owns its layer |

### Session 2 - The decision it serves
| Source | Tier | Cover |
|---|---|---|
| GQM: Basili, Caldiera, Rombach, Encyclopedia of Software Engineering vol. 1, Wiley 1994, 528-532 | PRIMARY | ✓ goal, questions, metrics as a derivation |
| HEART: Rodden, Hutchinson, Fu, CHI 2010 | PRIMARY | ✓ all five, plus Goals-Signals-Metrics |
| North Star framework (Amplitude; metric credited to Sean Ellis) - https://amplitude.com/north-star | NO LIST | ✓ taught as a metric-selection framework, with no principle count |
| Kozyrkov, decision intelligence | NO LIST | ✓ taught as an interdisciplinary field definition, no numbered framework |
| Rogati, AI Hierarchy of Needs (Hacker Noon, June 2017) | NO LIST | ✓ the infrastructure-before-AI argument; no layer count given, renderings disagree on 4 vs 6 |

### Session 3 - Data as a product, and its contract
| Source | Tier | Cover |
|---|---|---|
| Data Mesh 4 principles, Dehghani 2020 - https://martinfowler.com/articles/data-mesh-principles.html | PRIMARY | ✓ all four |
| FAIR, Wilkinson et al., Scientific Data 3, 160018 (2016) - https://www.gofair.foundation/fair-principles | PRIMARY | ✓ all four principles and all fifteen sub-points |
| Dehghani's 8 data-product characteristics, Data Mesh (O'Reilly 2022) ch. 5/13 | SECONDARY | ✓ all eight, with the paywall stated and the looser 2020 phrasing cited alongside |
| DAMA UK, The Six Primary Dimensions for Data Quality Assessment (Oct 2013) | SECONDARY | ✓ all six, with the members-only gate stated |
| Kimball vs Inmon | BOOK-ONLY | ✓ taught as a modelling fork, never as numbered tenets |

### Session 4 - The platform underneath
| Source | Tier | Cover |
|---|---|---|
| AWS Well-Architected, 6 pillars - https://docs.aws.amazon.com/wellarchitected/latest/framework/the-pillars-of-the-framework.html | PRIMARY | ✓ all six |
| AWS Data Analytics Lens, 6 general design principles (lens dated 2023-12-22) | SECONDARY | ✓ all six; count high confidence, exact wording secondary-sourced |
| 12-Factor App - https://12factor.net/ | PRIMARY | ✓ all twelve, applied to a data pipeline |
| CAP (Brewer 2000; Gilbert and Lynch 2002) and PACELC (Abadi, IEEE Computer 45(2) 37-42, 2012, DOI 10.1109/MC.2012.33) | PRIMARY | ✓ both, with the point that CAP only describes partition behaviour |
| Reactive Manifesto v2.0, 2014-09-16 - https://www.reactivemanifesto.org/ | PRIMARY | ✓ all four traits |
| Lakehouse, Zaharia/Ghodsi/Xin/Armbrust et al., CIDR 2021 | NO LIST | ✓ taught as an architecture pattern; the paper enumerates no principles |

### Session 5 - Operating the promise
| Source | Tier | Cover |
|---|---|---|
| DataOps Manifesto - https://www.dataopsmanifesto.org/ | PRIMARY | ✓ all eighteen, plus the later "start with data testing" |
| Google SRE, four golden signals, SRE book ch. 6 - https://sre.google/sre-book/monitoring-distributed-systems/ | PRIMARY | ✓ all four, translated to a pipeline |
| Agile Manifesto 12 principles - https://agilemanifesto.org/principles.html | PRIMARY | ◐ cited as the DataOps ancestor for delivery cadence |
| SLOs and error budgets | PRIMARY | ✓ applied to freshness |

### Session 6 - Truth on the surface
| Source | Tier | Cover |
|---|---|---|
| Few, Common Pitfalls in Dashboard Design (Feb 2006) - https://www.perceptualedge.com/articles/Whitepapers/Common_Pitfalls.pdf | PRIMARY (PDF read in full) | ✓ all thirteen |
| Tufte, The Visual Display of Quantitative Information (1983) and later works | BOOK-ONLY | ✓ data-ink, chartjunk, small multiples, lie factor, graphical integrity - by concept, no numbering |
| IBCS SUCCESS rules, Standards v1.2 - https://www.ibcs.com/ibcs-standards-1-2/ | SECONDARY | ✓ all seven; primary is JS-rendered, two agreeing secondaries used |
| NN/g dashboard guidance, Laubheimer 2017 - https://www.nngroup.com/articles/dashboards-preattentive/ | PRIMARY | ✓ preattentive attributes and chart-type preference |
| Gestalt principles, Wertheimer 1923 and the Gestalt school | BOOK-ONLY | ✓ proximity, similarity, closure, continuity, figure-ground; count varies by source |

### Session 7 - The interaction
| Source | Tier | Cover |
|---|---|---|
| NN/g 10 usability heuristics | PRIMARY | ✓ worked hard against analytics interaction |
| Shneiderman, Eight Golden Rules - https://www.cs.umd.edu/users/ben/goldenrules.html | PRIMARY | ✓ all eight |
| Tognazzini, First Principles of Interaction Design (2014 rev.) - https://asktog.com/atc/principles-of-interaction-design/ | PRIMARY | ✓ all nineteen named; three drawn out for analytics |
| Norman, The Design of Everyday Things (1988, rev. 2013) | BOOK-ONLY | ✓ affordance, signifier, mapping, feedback, constraint, conceptual model - no canonical count |
| ISO 9241-110 dialogue principles (2020, 2nd ed.) | SECONDARY | ✓ all seven; ISO document paywalled, close secondary quotation used |

### Session 8 - When the product is intelligent
| Source | Tier | Cover |
|---|---|---|
| Microsoft, 18 Guidelines for Human-AI Interaction, Amershi et al., CHI 2019, DOI 10.1145/3290605.3300233 | PRIMARY (PDF read in full) | ✓ all eighteen across four phases, with the 150-recommendation, 49-practitioner provenance |
| Google PAIR, People + AI Guidebook - https://pair.withgoogle.com/guidebook/chapters | PRIMARY | ✓ all six chapters |
| Apple HIG, machine learning - https://developer.apple.com/design/human-interface-guidelines/machine-learning | PRIMARY (rendered page) | ✓ the four dichotomies as feature triage |

### Session 9 - The review
| Source | Tier | Cover |
|---|---|---|
| Nielsen, Severity Ratings | PRIMARY | ✓ applied live to four Tideline findings |
| Nielsen and Molich (1990) | PRIMARY | ✓ independent-then-pooled, and why one reviewer is not enough on a layered product |
| All nine lenses from sessions 1-8 | mixed | ✓ run together, marginal contribution measured per lens |

## Not covered, by design

- **Chart choice and encoding craft**, and **dashboard build and layout craft**. Both are owned
  by sibling courses and session 6 links out to them rather than restating them. This course
  asks whether a screen tells the truth and whether that can be proved, not how to draw it.
- **Certification and formal assessment** against any of these standards. IBCS runs its own
  certification; ISO sells its standards. Those stay with their owners.
- **Tool-specific implementation.** No Power BI, Tableau or dbt syntax. The instrument is
  tool-independent on purpose.
- **The full fifteen-sub-point FAIR compliance process** as used in research data management.
  Session 3 teaches all fifteen sub-points as review checks, not the RDM workflow around them.

## The measured numbers, and which are modelled

The bench in sessions 1 and 9 renders Tideline into the page and every check queries that
rendered DOM. There is no answer key.

- **Lens ladder, cumulative unique findings:** NN/g 5 · +Few 10 · +Tufte 11 · +IBCS 11 ·
  +Microsoft 14 · +PAIR 14 · +data product 17 · +DataOps 19 · +GQM 20.
- **IBCS and PAIR add zero** on this product. Both are good sets; everything they catch here
  was already caught. That is what overlap looks like.
- **Computed detail:** lie factor 6.5 to 1 from drawn bar heights · 13 distinct fills from
  resolved computed colours · 64px below the fold from real overflow.
- **Exhaustive pass:** same 20 caught, 12 false flags, precision 100 to 63 percent.
- **Review cost, 66 and 144 minutes: MODELLED**, a flat per-lens and per-finding estimate.
  Labelled as a model on the widget.
- **Contract validator:** sample scores 7 of 22; adding `lineage:`, `slo:`, `classification:`,
  `catalog:` and `uniqueness:` gives 14 of 22.
- **Severity defaults:** emails in the clear 3.7 · truncated axis 3.7 · gauge 2.3 ·
  four decimal places 2.0.

## Re-verification note

Two of these sources move: the Google PAIR guidebook has a v2, and the AWS Analytics Lens is
revised periodically. Re-check both before delivering the course. The 1994, 2006 and 2019
sources are stable.
