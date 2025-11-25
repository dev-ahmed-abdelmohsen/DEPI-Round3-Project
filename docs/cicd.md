# CI/CD Pipeline Guide

This document provides an overview of the Continuous Integration and Continuous Deployment (CI/CD) pipeline for the SocialDev project, which is implemented using GitHub Actions.

## Workflow File

The pipeline is defined in the workflow file located at `.github/workflows/ci-cd.yml`.

## Triggers

The workflow is automatically triggered by the following events:

-   **Push**: When code is pushed to the `main` or `master` branches.
-   **Pull Request**: When a pull request is opened or updated targeting the `main` or `master` branches.
-   **Manual Dispatch**: The workflow can also be run manually from the GitHub Actions tab (`workflow_dispatch`).

## Jobs

The pipeline consists of two main jobs that run in sequence: `test-and-validate` and `build-and-push`.

### 1. `test-and-validate`

This job runs on every trigger and is responsible for ensuring the code quality, correctness, and validity of configurations.

**Steps:**

1.  **Code Checkout**: Checks out the repository code.
2.  **Node.js Setup**: Sets up a Node.js v20 environment.
3.  **Linting**:
    -   **Workflow Linting**: Lints the GitHub Actions workflow file itself to ensure correct syntax.
    -   **Dockerfile Linting**: Uses `hadolint` to check the `backend/Dockerfile` for common mistakes and best practice violations.
4.  **Backend Tests**:
    -   Navigates to the `backend` directory.
    -   Installs dependencies using `npm ci` for a clean install.
    -   Runs the automated tests with `npm test`.
5.  **Frontend Tests**:
    -   Navigates to the `frontend` directory.
    -   Installs dependencies using `npm ci`.
    -   Runs the automated tests with `npm test`.
6.  **Docker Compose Validation**:
    -   Checks that the `docker-compose.yml` file has a valid syntax.
    -   Attempts to start all services using `docker compose up -d`.
    -   Confirms that the containers are running and then tears them down. This serves as a basic integration test.
7.  **Kubernetes Manifest Validation**:
    -   Installs `kubeval`, a tool for validating Kubernetes configuration files.
    -   Validates all `.yaml` files in the `k8s/` directory against the Kubernetes schemas to catch syntax errors early.

## SonarCloud Analysis

In addition to the main CI/CD pipeline, there is a separate workflow for static code analysis using SonarCloud.

### Workflow File

The SonarCloud analysis workflow is defined in `.github/workflows/sonarcloud-analysis.yml`.

### Triggers

This workflow is triggered by:

-   **Push**: On pushes to the `main` or `master` branches.
-   **Pull Request**: When a pull request is opened or updated targeting the `main` or `master` branches.
-   **Manual Dispatch**: Can be run manually from the GitHub Actions tab.

### Purpose

This workflow runs the SonarCloud scanner to perform static analysis on the codebase to detect bugs, vulnerabilities, and code smells. It is a non-blocking workflow, meaning it will not prevent pull requests from being merged.

### Configuration

For this workflow to run successfully, you need to configure the following in your GitHub repository's **Settings > Secrets and variables > Actions**:

-   **Secrets**:
    -   `SONAR_TOKEN`: A SonarCloud token with analysis permissions.
-   **Variables**:
    -   `SONAR_PROJECT_KEY`: The key of your project in SonarCloud.
    -   `SONAR_ORGANIZATION`: The key of your organization in SonarCloud.

### 2. `build-and-push`

This job runs only after `test-and-validate` has completed successfully, and only on pushes to the `main` or `master` branch. It is responsible for building and publishing the Docker images for the frontend and backend services.

**Steps:**

1.  **Code Checkout**: Checks out the repository code.
2.  **Login to Docker Hub**: Authenticates with Docker Hub using credentials stored in GitHub secrets.
    -   `vars.DOCKERHUB_USERNAME`: The Docker Hub username, stored as a GitHub repository variable.
    -   `secrets.DOCKERHUB_TOKEN`: A Docker Hub access token, stored as a GitHub repository secret.
3.  **Set up Docker Buildx**: Initializes the Buildx builder, which is required for multi-platform builds and other advanced features.
4.  **Build and Push Backend**:
    -   Builds the Docker image from `backend/Dockerfile`.
    -   Pushes the image to Docker Hub with two tags:
        -   `georgemedhat/socialdev-backend:latest`
        -   `georgemedhat/socialdev-backend:<git-sha>` (e.g., `...:a1b2c3d4`)
5.  **Build and Push Frontend**:
    -   Builds the Docker image from `frontend/Dockerfile`.
    -   Pushes the image to Docker Hub with two tags:
        -   `georgemedhat/socialdev-frontend:latest`
        -   `georgemedhat/socialdev-frontend:<git-sha>`
