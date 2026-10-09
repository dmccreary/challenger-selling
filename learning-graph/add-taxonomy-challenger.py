#!/usr/bin/env python3
"""
Add taxonomy IDs to the Challenger Selling learning graph CSV.
"""

import csv

# Define taxonomy mappings based on concept ID ranges
taxonomy_map = {}

# CHAL - Challenger Sales Methodology (1-25)
for i in range(1, 26):
    taxonomy_map[i] = "CHAL"

# STORY - Storytelling Fundamentals (26-60)
for i in range(26, 61):
    taxonomy_map[i] = "STORY"

# PSYCH - Psychology of Decision-Making (33-50)
for i in range(33, 51):
    taxonomy_map[i] = "PSYCH"

# PERSONA - Buyer Personas and Segmentation (61-78)
for i in range(61, 79):
    taxonomy_map[i] = "PERSONA"

# OBJEC - Objection Handling (79-84)
for i in range(79, 85):
    taxonomy_map[i] = "OBJEC"

# PORTF - Story Portfolio Management (85-90)
for i in range(85, 91):
    taxonomy_map[i] = "PORTF"

# AIGEN - AI-Assisted Story Generation (91-100)
for i in range(91, 101):
    taxonomy_map[i] = "AIGEN"

# AGENT - Interactive Sales Agents (101-117)
for i in range(101, 118):
    taxonomy_map[i] = "AGENT"

# GRAPH - Graph Database Fundamentals (118-127)
for i in range(118, 128):
    taxonomy_map[i] = "GRAPH"

# GSALE - Graph Database Sales Stories (133-138)
for i in range(133, 139):
    taxonomy_map[i] = "GSALE"

# AIFRAME - AI Framework Fundamentals (139-149)
for i in range(139, 150):
    taxonomy_map[i] = "AIFRAME"

# AISALE - AI Framework Sales Stories (150-154)
for i in range(150, 155):
    taxonomy_map[i] = "AISALE"

# ITEXT - Intelligent Textbook Tools (155-167)
for i in range(155, 168):
    taxonomy_map[i] = "ITEXT"

# ITSALE - Intelligent Textbook Sales Stories (168-171)
for i in range(168, 172):
    taxonomy_map[i] = "ITSALE"

# METRIC - Story Effectiveness Measurement (172-184)
for i in range(172, 185):
    taxonomy_map[i] = "METRIC"

# DELIV - Story Delivery and Integration (185-200)
for i in range(185, 201):
    taxonomy_map[i] = "DELIV"

# COACH - Story-Based Coaching (201-207)
for i in range(201, 208):
    taxonomy_map[i] = "COACH"

# LIBRY - Story Libraries and Customization (208-217)
for i in range(208, 218):
    taxonomy_map[i] = "LIBRY"

# TRUST - Story Trust Building (226-230)
for i in range(226, 231):
    taxonomy_map[i] = "TRUST"

# ETHIC - Story Ethics and Compliance (231-236)
for i in range(231, 237):
    taxonomy_map[i] = "ETHIC"

# CREATE - Story Creation Process (237-245)
for i in range(237, 246):
    taxonomy_map[i] = "CREATE"

# TEMPL - Story Templates and Frameworks (246-253)
for i in range(246, 254):
    taxonomy_map[i] = "TEMPL"

# DASHB - Story Analytics Dashboard (254-258)
for i in range(254, 259):
    taxonomy_map[i] = "DASHB"

# INNOV - Story Innovation and Strategy (259-264)
for i in range(259, 265):
    taxonomy_map[i] = "INNOV"

# CRISIS - Story Crisis Management (270-276)
for i in range(270, 277):
    taxonomy_map[i] = "CRISIS"

# IMPRO - Story Continuous Improvement (277-285)
for i in range(277, 286):
    taxonomy_map[i] = "IMPRO"

# STRAT - Story Strategic Planning (286-296)
for i in range(286, 297):
    taxonomy_map[i] = "STRAT"

# SUCCE - Story Success Metrics (312-319)
for i in range(312, 320):
    taxonomy_map[i] = "SUCCE"

# ALIGN - Story Strategic Alignment (320-325)
for i in range(320, 326):
    taxonomy_map[i] = "ALIGN"

# ARCH - Story Integration Architecture (333-342)
for i in range(333, 343):
    taxonomy_map[i] = "ARCH"

# DISAS - Story Disaster Recovery (343-353)
for i in range(343, 354):
    taxonomy_map[i] = "DISAS"

# DEVOP - Story DevOps and Testing (354-360)
for i in range(354, 361):
    taxonomy_map[i] = "DEVOP"

# AIADV - Advanced AI for Stories (373-391)
for i in range(373, 392):
    taxonomy_map[i] = "AIADV"

# IMM - Immersive Story Experiences (393-399)
for i in range(393, 400):
    taxonomy_map[i] = "IMM"

# CAP - Capstone Project (401)
taxonomy_map[401] = "CAP"

# Handle remaining concepts that weren't explicitly mapped
# Cross-Selling through Story Customization (222-225)
for i in range(222, 226):
    taxonomy_map[i] = "LIBRY"

# Story Governance (265-269)
for i in range(265, 270):
    taxonomy_map[i] = "INNOV"

# Story Resource Allocation through Knowledge Management (289-296)
for i in range(289, 297):
    taxonomy_map[i] = "STRAT"

# Story Mentoring through Incentive Programs (300-303)
for i in range(300, 304):
    taxonomy_map[i] = "COACH"

# Story Culture Building through Change Management (304-311)
for i in range(304, 312):
    taxonomy_map[i] = "COACH"

# Story Communication through Executive Sponsorship (309-311)
for i in range(309, 312):
    taxonomy_map[i] = "COACH"

# Story Executive Summaries (318-319)
for i in range(318, 320):
    taxonomy_map[i] = "SUCCE"

# Story Resource Optimization through Demand Management (326-329)
for i in range(326, 330):
    taxonomy_map[i] = "ALIGN"

# Story Supply Chain through Ecosystem (329-332)
for i in range(329, 333):
    taxonomy_map[i] = "ALIGN"

# Story Availability (342)
taxonomy_map[342] = "ARCH"

# Story Asset Management (350)
taxonomy_map[350] = "DEVOP"

# Story Accessibility (360)
taxonomy_map[360] = "DEVOP"

# Story Internationalization through Globalization (361-363)
for i in range(361, 364):
    taxonomy_map[i] = "DEVOP"

# Story Cultural Adaptation through Translation (364-366)
for i in range(364, 367):
    taxonomy_map[i] = "DEVOP"

# Story Personalization through Targeting (367-369)
for i in range(367, 370):
    taxonomy_map[i] = "LIBRY"

# Story Recommendations through Machine Learning (370-372)
for i in range(370, 373):
    taxonomy_map[i] = "AIADV"

# Story Artificial Intelligence (373)
taxonomy_map[373] = "AIADV"

# Story Natural Language Processing through Speech Recognition (374-377)
for i in range(374, 378):
    taxonomy_map[i] = "AIADV"

# Story Text-to-Speech through Translation AI (377-379)
for i in range(377, 380):
    taxonomy_map[i] = "AIADV"

# Story Sentiment AI through Behavior AI (380-382)
for i in range(380, 383):
    taxonomy_map[i] = "AIADV"

# Story Pattern Recognition through Anomaly Detection (383-384)
for i in range(383, 385):
    taxonomy_map[i] = "AIADV"

# Story Predictive Modeling through Time Series Analysis (385-389)
for i in range(385, 390):
    taxonomy_map[i] = "AIADV"

# Story Forecasting through Optimization (390-391)
for i in range(390, 392):
    taxonomy_map[i] = "AIADV"

# Story Simulation through Digital Twin (392-393)
for i in range(392, 394):
    taxonomy_map[i] = "AIADV"

# Story Virtual Reality through Mixed Reality (394-396)
for i in range(394, 397):
    taxonomy_map[i] = "IMM"

# Story Immersive Experience through Gamification (397-398)
for i in range(397, 399):
    taxonomy_map[i] = "IMM"

# Story Serious Games (399)
taxonomy_map[399] = "IMM"

# Read the CSV and add taxonomy
input_file = 'learning-graph.csv'
output_file = 'learning-graph-with-taxonomy.csv'

with open(input_file, 'r') as infile, open(output_file, 'w', newline='') as outfile:
    reader = csv.reader(infile)
    writer = csv.writer(outfile)

    # Read header and add TaxonomyID column
    header = next(reader)
    header.append('TaxonomyID')
    writer.writerow(header)

    # Process each row
    for row in reader:
        concept_id = int(row[0])
        taxonomy_id = taxonomy_map.get(concept_id, 'MISC')
        row.append(taxonomy_id)
        writer.writerow(row)

print(f"✅ Taxonomy added to CSV")
print(f"Output: {output_file}")
