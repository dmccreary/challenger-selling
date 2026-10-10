# Quiz: Story Architecture, DevOps & Testing

Test your understanding of storytelling system architecture, DevOps practices, and quality assurance testing with these 10 review questions.

---

#### 1. What does CI/CD stand for in the context of storytelling systems?

<div class="upper-alpha" markdown>
1. Continuous Integration / Continuous Deployment
2. Customer Integration / Continuous Delivery
3. Configuration Inspection / Continuous Design
4. Content Integration / Data Control
</div>

??? question "Show Answer"
    The correct answer is **A**. CI/CD stands for Continuous Integration and Continuous Deployment (or Delivery). These practices automate building, testing, and deploying storytelling system changes, enabling rapid iteration and reliable releases.

    **Concept Tested:** Story CI/CD

---

#### 2. Which testing type is performed by actual users or their representatives to validate that the system meets business requirements before deployment?

<div class="upper-alpha" markdown>
1. Unit Testing
2. Integration Testing
3. System Testing
4. User Acceptance Testing
</div>

??? question "Show Answer"
    The correct answer is **D**. User Acceptance Testing (UAT) involves real users validating the system against business requirements. Unit, integration, and system testing are performed by developers or QA specialists at earlier stages.

    **Concept Tested:** Story User Acceptance Testing

---

#### 3. Why is "defense in depth" recommended for story security architecture?

<div class="upper-alpha" markdown>
1. It is the cheapest security approach
2. It relies entirely on perimeter firewalls
3. It eliminates the need for authentication
4. It applies multiple layers of protection so a single failure does not compromise the system
</div>

??? question "Show Answer"
    The correct answer is **D**. Defense in depth uses authentication, authorization, encryption, monitoring, and other controls in layers. If one layer fails, others still protect the system. It is not the cheapest approach and does not replace authentication.

    **Concept Tested:** Story Security Architecture

---

#### 4. You need to verify how a new story recommendation component interacts with the CRM. Which testing type is most appropriate?

<div class="upper-alpha" markdown>
1. Integration Testing
2. Unit Testing
3. System Testing
4. User Acceptance Testing
</div>

??? question "Show Answer"
    The correct answer is **A**. Integration Testing checks how components or systems work together, such as a story module and a CRM API. Unit testing isolates individual components, system testing validates end-to-end workflows, and UAT involves real users.

    **Concept Tested:** Story Testing Strategy

---

#### 5. Testing the complete story creation, approval, and deployment workflow end-to-end is best classified as:

<div class="upper-alpha" markdown>
1. Unit Testing
2. Integration Testing
3. System Testing
4. User Acceptance Testing
</div>

??? question "Show Answer"
    The correct answer is **C**. System Testing validates complete end-to-end workflows. Unit and integration testing cover smaller scopes, while UAT is user-focused validation before production.

    **Concept Tested:** Story Testing Strategy

---

#### 6. In disaster recovery planning, Recovery Time Objective (RTO) defines:

<div class="upper-alpha" markdown>
1. The amount of data loss that is acceptable
2. How quickly systems must be restored after a disruption
3. The number of backup copies required
4. The budget available for recovery
</div>

??? question "Show Answer"
    The correct answer is **B**. RTO specifies the maximum acceptable downtime after a disaster. Recovery Point Objective (RPO) defines acceptable data loss, while copy counts and budgets are separate planning considerations.

    **Concept Tested:** Story Disaster Recovery

---

#### 7. A production release of the story platform causes errors and cannot be quickly reverted. Which DevOps practice was most likely missing?

<div class="upper-alpha" markdown>
1. Unit testing
2. Release management with rollback capability
3. User acceptance testing
4. Load testing
</div>

??? question "Show Answer"
    The correct answer is **B**. Release management should include rollback plans so failed deployments can be reverted quickly. While testing reduces the chance of failure, the inability to revert points directly to missing rollback capability in release management.

    **Concept Tested:** Story Release Management

---

#### 8. Which configuration management practice is recommended to support different environments without code changes?

<div class="upper-alpha" markdown>
1. Hardcode configuration values in source code
2. Make configuration changes manually in production only
3. Use environment variables or configuration files
4. Avoid version control for configuration
</div>

??? question "Show Answer"
    The correct answer is **C**. Externalizing configuration into environment variables or config files lets the same code run in development, testing, and production with different settings. Hardcoding, manual production edits, and unversioned config create maintenance and reliability problems.

    **Concept Tested:** Story Configuration Management

---

#### 9. Why should configuration be separated from code in storytelling systems?

<div class="upper-alpha" markdown>
1. To enable environment-specific changes without redeploying code
2. To reduce the number of tests needed
3. To make systems less secure
4. To increase coupling between components
</div>

??? question "Show Answer"
    The correct answer is **A**. Separating configuration from code allows settings to change per environment without requiring a full code build and deployment. This reduces risk and increases flexibility. It does not reduce testing, improve security by itself, or increase coupling.

    **Concept Tested:** Story Configuration Management

---

#### 10. When designing a story platform, which testing discipline ensures it is usable by people who rely on screen readers and keyboard navigation?

<div class="upper-alpha" markdown>
1. Security Testing
2. Accessibility Testing
3. Compliance Testing
4. Performance Testing
</div>

??? question "Show Answer"
    The correct answer is **B**. Accessibility Testing verifies that systems work for people with disabilities, including screen reader and keyboard navigation support. Security, compliance, and performance testing address different quality dimensions.

    **Concept Tested:** Story Accessibility Testing

---
