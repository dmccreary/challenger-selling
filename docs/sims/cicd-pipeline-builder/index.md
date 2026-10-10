---
title: "CI/CD Pipeline Builder"
description: "Learners choose the automated actions for the build, test, and deploy stages of a story library pipeline, avoiding manual steps and skipped tests, and see the pipeline drawn as a flow."
image: /sims/cicd-pipeline-builder/cicd-pipeline-builder.png
og:image: /sims/cicd-pipeline-builder/cicd-pipeline-builder.png
twitter:image: /sims/cicd-pipeline-builder/cicd-pipeline-builder.png
social:
   cards: false
status: built
---

# CI/CD Pipeline Builder

<iframe src="main.html" height="762px" width="100%" scrolling="no"></iframe>

[Run the CI/CD Pipeline Builder MicroSim Fullscreen](./main.html){ .md-button .md-button--primary }

## About This MicroSim

**CI/CD** (continuous integration and continuous delivery) automatically builds, tests, and deploys every change. It applies to storytelling assets (stories, slides, metadata, video links) as much as to code.

In this MicroSim you design a pipeline for story library updates. Each stage offers three good automated actions and one tempting bad one: a manual review in the build, skipping tests for "content-only" changes, or a manual file copy to production. The result draws your pipeline from commit to production, marks each stage, and shows whether a rollback is available.

**Learning objective (Apply, *design*):** Design a CI/CD pipeline by selecting appropriate stages (build, test, deploy) and defining the automated actions for each stage.

## How to Use

1. Read the pipeline scenario.
2. For each stage, check every action the pipeline should perform automatically.
3. Select **Build Pipeline** to see feedback and the pipeline flow.
4. Adjust any stage and rebuild.

## Iframe Embed Code

You can add this MicroSim to any web page by adding this to your HTML:

```html
<iframe src="https://dmccreary.github.io/challenger-selling/sims/cicd-pipeline-builder/main.html"
        height="762px"
        width="100%"
        scrolling="no"></iframe>
```

## Lesson Plan

### Audience
Sales professionals, account executives, sales engineers and business development managers.

### Duration
10 minutes

### Prerequisites
- Story CI/CD and Story Build and Deploy sections of Chapter 15

### Activities

1. **Design** (4 min): Build a pipeline where every stage passes.
2. **Failure analysis** (3 min): Check "Skip tests for content-only changes." Describe a real story defect that would reach reps.
3. **Discussion** (3 min): How often does your team publish story updates today, and what slows it down?

### Common Misconceptions
- CI/CD is only for code.
- Manual steps are acceptable.
- Testing is optional.

### Assessment
- All three stages contain only the automated actions and nothing manual.
- Learner can explain why rollback matters for frequent releases.

## References

1. [CI/CD - Wikipedia](https://en.wikipedia.org/wiki/CI/CD) - Continuous integration and continuous delivery.
2. [Continuous delivery - Wikipedia](https://en.wikipedia.org/wiki/Continuous_delivery) - Keeping software always ready to release.
3. [Deployment environment - Wikipedia](https://en.wikipedia.org/wiki/Deployment_environment) - Staging and production environments.
