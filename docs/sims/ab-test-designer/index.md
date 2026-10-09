---
title: A/B Test Designer
description: Learners design an A/B test of a price objection story by choosing one variable, writing a hypothesis, and picking a success metric, then decide whether early and later results are statistically significant.
image: /sims/ab-test-designer/ab-test-designer.png
og:image: /sims/ab-test-designer/ab-test-designer.png
twitter:image: /sims/ab-test-designer/ab-test-designer.png
social:
   cards: false
status: built
---

# A/B Test Designer

<iframe src="main.html" height="742px" width="100%" scrolling="no"></iframe>

[Run the A/B Test Designer MicroSim Fullscreen](./main.html){ .md-button .md-button--primary }

## About This MicroSim

**A/B testing** compares the current version of a story (A) against a variation (B) that changes exactly one thing. If you change everything at once and B wins, you will not know why.

In this MicroSim you design a test for a price objection story in three steps: pick the single variable Story B will change, write a hypothesis, and choose the primary success metric. Feedback rejects multi-variable designs and explains why conversion rate is a stronger primary metric than engagement or recall. Then you **run the test**: after two weeks Story B is ahead by six points on 100 deals per version, and you must decide whether to switch. Eight weeks later the same gap appears on 400 deals per version. A real two-proportion significance test shows why the same difference means nothing at first and something later.

**Learning objective (Apply, *design*):** Design an A/B test by selecting the variable to test, defining the hypothesis, and identifying the success metric.

## How to Use

1. Read the scenario.
2. Step 1: choose the one variable Story B will change.
3. Step 2: write a hypothesis, or select **Start from a template** and edit it.
4. Step 3: choose the primary success metric, then select **Submit Test Design**.
5. Select **Run the Test**, decide whether each round of results justifies switching, and read the significance explanation.
6. Review the summary, then select **Design Another Test** to try a different variable or metric.

## Iframe Embed Code

You can add this MicroSim to any web page by adding this to your HTML:

```html
<iframe src="https://dmccreary.github.io/challenger-selling/sims/ab-test-designer/main.html"
        height="742px"
        width="100%"
        scrolling="no"></iframe>
```

## Lesson Plan

### Audience
Sales professionals, account executives, sales engineers and business development managers.

### Duration
12 minutes

### Prerequisites
- A/B Testing Stories section of Chapter 9

### Activities

1. **Design** (4 min): Build a valid test. Then deliberately choose "All four at once" and read why it fails.
2. **Interpretation** (4 min): Decide on both rounds of results. Why is a six-point gap not significant at 100 deals per version but significant at 400?
3. **Transfer** (4 min): Write a one-variable hypothesis for a story your team uses today.

### Common Misconceptions
- A/B testing compares everything at once.
- A/B testing requires large sample sizes.
- Any difference matters.

### Assessment
- A valid one-variable design with a directional hypothesis and conversion rate as the primary metric.
- Correct decisions on both rounds of results.

## References

1. [A/B testing - Wikipedia](https://en.wikipedia.org/wiki/A/B_testing) - Controlled two-variant experiments.
2. [Statistical significance - Wikipedia](https://en.wikipedia.org/wiki/Statistical_significance) - Why some differences are likely to be chance.
3. [Hypothesis - Wikipedia](https://en.wikipedia.org/wiki/Hypothesis) - Writing testable predictions.
