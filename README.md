# Attendify
AI-Powered Behavioral Attendance Monitoring System

Project Overview: This system leverages artificial intelligence to analyze student attendance behavior, flag anomalies, and generate actionable insights for administrators. It replaces manual attendance tracking with an automated, smart monitoring system that highlights trends and risky behaviors through machine learning.  So, instead of just recording if someone was present or absent, it learns when, how often, and how consistently students attend, then flags any unusual behavior.

Key Features: 
Manual or imported attendance logging 
AI-driven anomaly detection 
Risk profile generation per student 
Real-time admin alerts and dashboards 
Exportable attendance reports (CSV/PDF) 

Unique Aspects: 
AI-based anomaly detection for behavioral trends 
Dynamic risk profiling dashboard 
Alert system for flagged attendance issues 

Emerging Technologies: 
Artificial Intelligence (AI) – Behavior classification and detection 
Machine Learning (ML) – Isolation Forest model for identifying irregular patterns 

Sample Flow
How the AI/ML System Works – Step by Step
1. Data Collection
Each time an attendance is logged, the system stores:
Student ID
Subject
Date & Time
Day of the Week

2. Feature Extraction
The system extracts relevant features from the raw data:
hour of login
weekday (Monday–Sunday)

3. Anomaly Detection
Using Isolation Forest, the system:
Learns normal attendance behaviors from existing data
Flags entries that don’t fit the usual pattern
Assigns an anomaly score to each attendance log
(a very low score = highly suspicious behavior)




4. Flagging Risk Profiles
If a student accumulates several anomalies:
The system increases their risk level (Low → Medium → High)
A Student Risk Profile Page updates automatically
Admins can view flagged entries and historical patterns

5. Smart Alerts
If a pattern is abnormal:
The system sends an alert to the admin dashboard
Admin can review, dismiss, or escalate the alert
This helps institutions intervene early if students are disengaging

