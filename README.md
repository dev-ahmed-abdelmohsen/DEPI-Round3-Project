# SocialDev: A DevOps-Driven YouTube Channel Companion

## 👥 Team Members
- Ahmed Abd Elmohsen - Team Leader
- Eslam Nasser 
- George Medhat 
- Mohamed Mahmoud 
- Mohamed khaled 
- Abdelrhman Hazem

---
## Google Drive

[Click here](https://drive.google.com/drive/folders/1aeULM9lA43SoK8bJTHFrGhPer631f2Z_?usp=sharing)

---
## 📌 Project Idea
A cloud-native application that helps users track their progress on YouTube channels. Users can input a channel URL, view its videos, mark them as watched, and take timestamped notes that can be exported.

### 🚀 Core Features
- **Channel Video Listing:** Fetches and displays all videos from a given YouTube channel.
- **Progress Tracking:** Mark videos as "watched" to keep track of your progress.
- **Video Notes:** Take and save notes for each video, with the ability to link them to specific timestamps.
- **Note Export:** Export your notes for a video or an entire channel.
- **Local Storage Only:** No user accounts; progress and notes are stored only in the user's browser local storage and are not cached on any server. Data can be exported for backup or transfer.

### 🛠️ Tools & Technologies
It’s built using **DevOps tools** for automation and scalability:
- **Next.js** for the frontend application.
- **Node.js** for the backend service.
- **n8n** for workflow automation.
- **Docker** for containerization.
- **Kubernetes** for orchestration.
- **Terraform and AWS** for infrastructure as code on the cloud.
- **Ansible** for configuration management.
- **Prometheus and Grafana** for monitoring and observability.

The goal is to apply DevOps culture to build, deploy, and monitor a scalable web application.

---
## 🗂️ Project Plan

### **Week 1 – Build & Containerize**
- [x] Develop application modules
- [x] Create Dockerfile for each service
- [x] Write docker-compose.yml for local development
- [ ] Implement CI pipeline (GitHub Actions)

### **Week 2 – Provision Infrastructure**
- [ ] Define Infrastructure
- [ ] Write Terraform configuration files

### **Week 3 – Configure & Deploy**
- [x] Create Kubernetes manifests
- [ ] Write Ansible playbooks

### **Week 4 – Monitor & Automate**
- [x] Monitoring & Logging
- [ ] CI/CD Enhancements

---
## 📝 Individual Roles and Responsibilities

| Member             | Role & Tasks                          |
|--------------------|---------------------------------------|
| George Medhat      | Support: Dev, k8s, monitoring, Docker |
| Eslam Nasser       | Docker, CI/CD                         |
| Abdelrhman Hazem   | Docker, CI/CD                         |
| Ahmed Abd Elmohsen | Dev, k8s, monitoring                  |
| Mohamed Mahmoud    | k8s, monitoring                       |
| Mohamed khaled     | Ansible, cloud                        |

---

## 📚 Module Documentation

-   **[Frontend Service Readme](frontend/README.md)**: Instructions for setting up and running the frontend service locally.
-   **[Backend Service Readme](backend/README.md)**: Instructions for setting up and running the backend service locally.
-   **[Docker Setup Guide](docs/DOCKER.md)**: An overview of the Docker configuration for local development.
-   **[Kubernetes Setup Guide](docs/KUBERNETES.md)**: An overview of the Kubernetes configuration for deployment.
-   **[Backend API Documentation](docs/backend-api.md)**: Detailed documentation of the backend API endpoints.
-   **[Monitoring Guide](docs/monitoring.md)**: A guide to the project's monitoring and observability stack (Prometheus & Grafana).
-   **[CI/CD Pipeline Guide](docs/cicd.md)**: An explanation of the Continuous Integration and Deployment pipeline.

---

## 📊 SonarCloud Quality Gate

[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=learnaholic-bit_DEPI-Round3-Project&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=learnaholic-bit_DEPI-Round3-Project)

You can find the full analysis on [SonarCloud](https://sonarcloud.io/project/overview?id=learnaholic-bit_DEPI-Round3-Project).
