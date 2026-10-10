# FAQ Quality Report

Generated: 2026-10-09

## Overall Statistics

- **Total Questions:** 76
- **Overall Quality Score:** 78/100
- **Content Completeness Score:** 95/100 (course description 100/100, valid 400-concept DAG, 3,186-line glossary, 71,000+ words across 17 chapters)
- **Concept Coverage:** 57.9% (230/397 concepts referenced by name in a question or answer)

## Category Breakdown

### Getting Started Questions
- Questions: 12
- Bloom's Levels: Remember (4), Understand (8)
- Avg Word Count: 119.6
- Examples: 33.3% | Links: 100%

### Core Concepts
- Questions: 24
- Bloom's Levels: Understand (19), Apply (5)
- Avg Word Count: 129.2
- Examples: 29.2% | Links: 100%

### Technical Detail Questions
- Questions: 20
- Bloom's Levels: Remember (11), Analyze (9)
- Avg Word Count: 110.8
- Examples: 60.0% | Links: 100%

### Common Challenge Questions
- Questions: 8
- Bloom's Levels: Apply (7), Analyze (1)
- Avg Word Count: 130.0
- Examples: 37.5% | Links: 100%

### Best Practice Questions
- Questions: 7
- Bloom's Levels: Evaluate (4), Apply (3)
- Avg Word Count: 118.9
- Examples: 42.9% | Links: 100%

### Advanced Topic Questions
- Questions: 5
- Bloom's Levels: Analyze (3), Evaluate (1), Create (1)
- Avg Word Count: 146.0
- Examples: 20.0% | Links: 100%

## Bloom's Taxonomy Distribution

Actual vs Target (targets are the skill's overall blended targets across all six categories):

| Level | Actual | Target | Deviation |
|-------|--------|--------|-----------|
| Remember | 19.7% | 20% | -0.3% ✓ |
| Understand | 35.5% | 30% | +5.5% |
| Apply | 19.7% | 25% | -5.3% |
| Analyze | 17.1% | 15% | +2.1% ✓ |
| Evaluate | 6.6% | 7% | -0.4% ✓ |
| Create | 1.3% | 3% | -1.7% ✓ |

Total absolute deviation: 15.3% → **Bloom's Score: 20/25** (falls in the 11–20% deviation band). The main imbalance is a surplus of Understand-level definitional questions relative to Apply-level how-to questions, concentrated in the Core Concepts category. A follow-up pass could convert 4–5 Core Concepts "What is X?" questions into "How do I apply X?" questions to tighten this.

## Answer Quality Analysis

- **Examples:** 30/76 (39.5%) — Target: 40%+ (just under threshold; scored in the 30–39% band)
- **Links:** 76/76 (100%) — Target: 60%+ ✓ (every answer links to at least one source file; many link to two)
- **Avg Length:** 123.1 words — Target: 100–300 ✓ (shortest answer is 67 words, longest 186 words; all are within or near the target range)
- **Complete Answers:** 76/76 (100%) ✓ — every answer stands alone and directly addresses its question

Answer Quality Score: 23/25 (Examples 5/7, Links 7/7, Length 6/6, Completeness 5/5)

## Concept Coverage

**Covered:** 230 of 397 learning-graph concepts (57.9%) are referenced by name across the 76 questions and answers — this spans all 19 taxonomy categories and all 17 chapters.

**Not Covered (167 concepts):** concentrated in three areas — advanced AI/immersive techniques from Chapter 16 (Story Machine Learning, Story Natural Language Processing, Story Speech Recognition, Story Translation AI, Story Sentiment AI, and similar leaf concepts), continuous-improvement and research practices from Chapter 13 (Story Experimentation, Story Customer Interviews, Story Market Research, Story Trend Analysis), and strategic-planning leaf concepts from Chapter 14 (Story Roadmap Development, Story Resource Allocation, Story Team Structure). See `faq-coverage-gaps.md` for the full prioritized list.

Coverage Score: 15/30 (57.9% falls in the 50–59% band)

## Organization Quality

- Logical categorization: ✓ (6 standard categories, ordered from introductory to advanced)
- Progressive difficulty: ✓ (Getting Started and Core Concepts skew Remember/Understand; Common Challenges, Best Practices, and Advanced Topics skew Apply/Analyze/Evaluate/Create)
- No duplicates: ✓ (76/76 unique questions verified programmatically)
- Clear questions: ✓ (every question is phrased as a complete, specific, searchable question ending in "?")

Organization Score: 20/20

## Overall Quality Score: 78/100

- Coverage: 15/30
- Bloom's Distribution: 20/25
- Answer Quality: 23/25
- Organization: 20/20

## Recommendations

### High Priority
1. Add 8–10 questions covering the highest-impact uncovered concepts: **Story Continuous Improvement** (CIS 36), **Story Personalization** (CIS 35), **Story Segmentation** (CIS 34), **Story A/B Testing** (CIS 32, distinct from the already-covered "A/B Testing Stories"), and **Story Artificial Intelligence** (CIS 29) — see `faq-coverage-gaps.md`.
2. Rebalance Bloom's distribution by converting several Core Concepts "What is X?" (Understand) questions into Apply-level "How do I use X in a specific scenario?" questions, closing the +5.5%/-5.3% Understand/Apply gap.

### Medium Priority
1. Add 2–3 more worked examples to the Core Concepts and Getting Started categories, which currently sit at 29–33% versus the 40% target, to pull the overall average above the threshold.
2. Add FAQ coverage for Chapter 16's advanced AI techniques (Story Natural Language Processing, Story Computer Vision, Story Speech Recognition) once that chapter's prose content is reviewed further, since these are currently only touched at a survey level in one Advanced Topics answer.

### Low Priority
1. Consider 1–2 additional Advanced Topics (Create-level) questions — the category currently has only one Create-level question against a 3% target, and Create is the most under-represented Bloom's level overall.
2. Revisit the shortest answers (faq-010, faq-054, faq-068, each under 90 words) to see if a second supporting sentence would strengthen them without padding.

## Suggested Additional Questions

Based on the concept gaps above, consider adding to a future revision:

1. "What is Story Continuous Improvement, and how does a sales team build it into a story program?" (Core Concepts)
2. "What is Story Personalization, and how is it different from Insight Personalization?" (Technical Detail)
3. "What is Story Segmentation, and how does it relate to buyer persona and industry vertical tailoring?" (Core Concepts)
4. "How is Story A/B Testing used to compare entire story variants, not just headlines or subject lines?" (Technical Detail)
5. "What is Story Voice of Customer research, and how does it feed new story ideation?" (Best Practice)
6. "How does Story Predictive Analytics differ from the Story Forecasting covered in Chapter 16?" (Advanced Topics)
7. "What is a Story Roadmap, and how does Story Strategic Planning connect it to company OKRs?" (Core Concepts)
8. "What is the difference between Story Market Research and Story Customer Interviews as input to the Story Creation Process?" (Technical Detail)
9. "How should a sales organization structure roles and responsibilities (Story Team Structure) for a mature story program?" (Advanced Topics)
10. "What is Story Sentiment AI, and how could it be combined with Challenger Insight Delivery?" (Advanced Topics)
