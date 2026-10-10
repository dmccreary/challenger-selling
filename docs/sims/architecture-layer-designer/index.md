---
title: "Architecture Layer Designer"
description: "Learners choose an integration, data, security, and scalability approach for a storytelling platform and see their architecture drawn as layers, with weak layers flagged."
image: /sims/architecture-layer-designer/architecture-layer-designer.png
og:image: /sims/architecture-layer-designer/architecture-layer-designer.png
twitter:image: /sims/architecture-layer-designer/architecture-layer-designer.png
social:
   cards: false
status: built
---

# Architecture Layer Designer

<iframe src="main.html" height="742px" width="100%" scrolling="no"></iframe>

[Run the Architecture Layer Designer MicroSim Fullscreen](./main.html){ .md-button .md-button--primary }

## About This MicroSim

A storytelling platform for thousands of reps is a real software system, and each layer of its architecture has a different job. Integration connects it to the CRM and other tools. The data layer stores stories, recordings, and usage. Security protects confidential customer results. Scalability handles quarter-end spikes.

In this MicroSim you choose an approach for each of the four layers, based on a short requirements statement. Feedback explains what each option is good and bad at. The result is a layered diagram, from story consumers to story sources, with each layer marked strong or weak.

**Learning objective (Apply, *design*):** Design a storytelling system architecture by selecting appropriate components for each layer (integration, data, security, scalability).

## How to Use

1. Read the platform requirements.
2. Choose one option for each of the four layers.
3. Select **Show Architecture** to see feedback and the layered diagram.
4. Change any layer and resubmit to compare designs.

## Iframe Embed Code

You can add this MicroSim to any web page by adding this to your HTML:

```html
<iframe src="https://dmccreary.github.io/challenger-selling/sims/architecture-layer-designer/main.html"
        height="742px"
        width="100%"
        scrolling="no"></iframe>
```

## Lesson Plan

### Audience
Sales professionals, account executives, sales engineers and business development managers.

### Duration
10 minutes

### Prerequisites
- Story Integration Architecture, Story Data Architecture, and Story Security Architecture sections of Chapter 15

### Activities

1. **Design** (5 min): Design all four layers and study the diagram.
2. **Trade-offs** (3 min): Why is "All three" the right integration choice, while "Defense in depth" is right for security?
3. **Transfer** (2 min): Ask your IT team which data architecture your current enablement platform uses.

### Common Misconceptions
- All layers are the same.
- Security is optional.
- Architecture is static.

### Assessment
- Recommended approach chosen for all four layers.
- Learner can explain why perimeter security is not enough.

## References

1. [Software architecture - Wikipedia](https://en.wikipedia.org/wiki/Software_architecture) - How systems are structured into layers.
2. [Defense in depth (computing) - Wikipedia](https://en.wikipedia.org/wiki/Defense_in_depth_(computing)) - Layered security controls.
3. [Autoscaling - Wikipedia](https://en.wikipedia.org/wiki/Autoscaling) - Adjusting capacity to demand automatically.
