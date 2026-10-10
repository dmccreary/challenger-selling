# FAQ Coverage Gaps

Concepts from the 397-concept learning graph (`learning-graph.json`) that are not yet referenced by name in `faq.md`. Coverage is measured by exact (case-insensitive) match of each concept's label against the text of all 76 FAQ questions and answers; 230 of 397 concepts (57.9%) are covered. Priority is ranked by each concept's Concept Impact Score (CIS), a PageRank-style centrality measure computed for the learning graph.

## Critical Gaps (High Priority)

High-centrality concepts (CIS ≥ 20) without FAQ coverage, grouped by the taxonomy category they belong to:

**Continuous Improvement (IMPRO) — Chapter 13**

1. **Story Continuous Improvement** (CIS 36) — Suggested question: "What is Story Continuous Improvement, and how does a sales team build it into a story program?" (Core Concepts)
2. **Story Innovation Labs** (CIS 34) — Suggested question: "What is a Story Innovation Lab, and how does it differ from ad hoc story experimentation?" (Core Concepts)
3. **Story Experimentation** (CIS 33) — Suggested question: "How does Story Experimentation differ from Story A/B Testing?" (Technical Detail)
4. **Story A/B Testing** (CIS 32) — Suggested question: "How is Story A/B Testing used to compare entire story variants, not just a single element?" (Technical Detail)
5. **Story User Research** (CIS 31) — Suggested question: "What role does Story User Research play before a new story is drafted?" (Best Practice)
6. **Story Customer Interviews** (CIS 30) — Suggested question: "How do Story Customer Interviews feed the Story Ideation stage?" (Technical Detail)
7. **Story Voice of Customer** (CIS 29) — Suggested question: "What is Story Voice of Customer, and how does it differ from Social Proof?" (Technical Detail)
8. **Story Market Research** (CIS 28) — Suggested question: "How does Story Market Research inform Story Differentiation?" (Core Concepts)
9. **Story Trend Analysis** (CIS 27) — Suggested question: "How is Story Trend Analysis used to keep a story portfolio current?" (Best Practice)

**Story Libraries & Customization (LIBRY) — Chapter 11**

10. **Story Personalization** (CIS 35) — Suggested question: "What is the difference between Story Personalization and Insight Personalization?" (Technical Detail)
11. **Story Segmentation** (CIS 34) — Suggested question: "How does Story Segmentation relate to buyer persona and industry vertical tailoring?" (Core Concepts)
12. **Story Targeting** (CIS 33) — Suggested question: "What is Story Targeting, and how is it different from Story Segmentation?" (Technical Detail)

**Advanced AI (AIADV) — Chapter 16**

13. **Story Recommendations** (CIS 32) — Suggested question: "How can a story system generate Story Recommendations for a specific deal automatically?" (Advanced Topics)
14. **Story Predictive Analytics** (CIS 31) — Suggested question: "How does Story Predictive Analytics differ from the Story Forecasting already covered?" (Advanced Topics)
15. **Story Machine Learning** (CIS 30) — Suggested question: "How is Story Machine Learning distinct from the AI-assisted story generation covered in Chapter 5?" (Advanced Topics)
16. **Story Artificial Intelligence** (CIS 29) — Suggested question: "What does 'Story Artificial Intelligence' mean as an umbrella category in Chapter 16?" (Core Concepts)
17. **Story Natural Language Processing** (CIS 26) — Suggested question: "What is Story Natural Language Processing, and how does it extend the NLU/NLG concepts from Chapter 5?" (Technical Detail)
18. **Story Speech Recognition** (CIS 25) — Suggested question: "How could Story Speech Recognition be used to capture voice-of-customer during a live call?" (Advanced Topics)
19. **Story Text-to-Speech** (CIS 24) — Suggested question: "What is the use case for Story Text-to-Speech in multi-channel delivery?" (Technical Detail)
20. **Story Translation AI** (CIS 22) — Suggested question: "How does Story Translation AI support a global story library?" (Technical Detail)
21. **Story Sentiment AI** (CIS 21) — Suggested question: "What is Story Sentiment AI, and how could it be combined with Challenger Insight Delivery?" (Advanced Topics)

**Strategic Planning (STRAT) — Chapter 14**

22. **Story Future Planning** (CIS 26) — Suggested question: "How does Story Future Planning connect to the Story Roadmap Development process?" (Core Concepts)
23. **Story Roadmap Development** (CIS 25) — Suggested question: "What goes into a Story Roadmap, and how does Story Strategic Planning connect it to company OKRs?" (Core Concepts)
24. **Story Strategic Planning** (CIS 24) — Suggested question: "How does Story Strategic Planning differ from Story Strategic Alignment, already covered in the FAQ?" (Technical Detail)
25. **Story Resource Allocation** (CIS 23) — Suggested question: "How does Story Resource Allocation relate to the Story Capacity Planning already covered?" (Technical Detail)
26. **Story Budget Planning** (CIS 22) — Suggested question: "How should Story Budget Planning account for both content creation and the technical architecture costs?" (Best Practice)
27. **Story Team Structure** (CIS 21) — Suggested question: "How should a sales organization structure Story Team Roles and Responsibilities for a mature story program?" (Advanced Topics)
28. **Story Roles and Responsibilities** (CIS 20) — see above, can be combined with Story Team Structure in a single question.

## Medium Priority Gaps

Moderate-centrality concepts (CIS 8–19) without FAQ coverage:

- Story Skill Development (CIS 19)
- Story Behavior AI (CIS 19)
- Story Training Programs (CIS 18)
- Story Onboarding (CIS 17)
- Story Knowledge Management (CIS 16)
- Story Documentation (CIS 15)
- Story Knowledge Sharing (CIS 14)
- Story Communities of Practice (CIS 13)
- Story Mentoring (CIS 12)
- Story Business Continuity (CIS 12)
- Story Time Series Analysis (CIS 12)
- Story Coaching Programs (CIS 11)
- Story Optimization (CIS 10) — note: distinct from the already-covered "Story Optimization" usage in the Story Effectiveness Measurement answer; worth a dedicated definition if the distinction matters
- Story Performance Recognition (CIS 10)
- Story Incentive Programs (CIS 9)
- Story Problem Management (CIS 9)
- Story Simulation (CIS 9)
- Cognitive Ease (CIS 8)
- Industry Vertical Segmentation (CIS 8)
- AI Ethical Considerations (CIS 8)
- Story Culture Building (CIS 8)
- Story Accessibility Testing (CIS 8)

## Low Priority Gaps

117 lower-centrality concepts (CIS < 8) are not covered, the majority of them narrow leaf nodes in the Chapter 15 (Story Architecture, DevOps & Testing) and Chapter 16 (Advanced AI & Immersive Experiences) taxonomy branches — for example specific testing types (Story Compliance Testing, Story Performance Testing), specific architecture layers (Story Privacy Architecture, Story Availability Architecture), and specific advanced-AI techniques (Story Clustering, Story Regression, Story Anomaly Detection). These are appropriately deep, specialized concepts that a comprehensive FAQ is not expected to cover individually; they are better served by the chapter content itself and the glossary.

## Recommendations

1. Add questions for all 28 critical gaps above, prioritizing the Continuous Improvement (IMPRO) and Story Libraries (LIBRY) groups since they have the highest average CIS and are closely related to concepts already well covered in the FAQ (Story Portfolio Management, Story Customization).
2. Consider adding 8–10 of the 22 medium-priority gaps in a future revision, focusing on the coaching and knowledge-management cluster (Story Training Programs, Story Onboarding, Story Knowledge Management, Story Mentoring) since these connect naturally to the existing Best Practice Questions on team coaching.
3. The 117 low-priority gaps can be addressed in a future, more technical FAQ revision or left to the glossary and chapter content, which already define each of them individually.
