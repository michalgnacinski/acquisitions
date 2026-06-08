# Acquisitions Setup (Neon Local for Dev, Neon Cloud for Prod)

This project uses two different database connection modes:
* **Development:** Neon Local proxy in Docker, with ephemeral branches.
* **Production:** Direct Neon Cloud URL via `DATABASE_URL`.

---

## 🛠 Tech Stack & Tools Used

Below is the list of technologies utilized in this project, along with their specific roles within the architecture and the DevOps lifecycle:

### Backend & Core
* **Node.js & Express** – The core of the application. The runtime environment and framework used to build the *Acquisitions* API, handle HTTP requests, and manage business logic.
* **ESLint** – A static code analysis tool (linter). It ensures code cleanliness, automatically detects syntax errors (such as undefined variables), and enforces a consistent formatting standard across the team.

### Databases & Security
* **Neon DB (Postgres)** – A serverless PostgreSQL database. This project leverages its unique *branching* feature to create isolated database environments.
* **Arcjet** – A security component integrated directly into the Node.js application. It protects the API from attacks, manages rate limiting, blocks malicious bots, and secures sensitive endpoints.

### Containerization & Local Environment
* **Docker** – The containerization tool. It packages the Node.js application along with its dependencies into a lightweight container, ensuring the code runs identically on your local machine and in production.
* **Neon Local (via Docker)** – A local proxy container used in the development environment. It automatically creates temporary database branches (*ephemeral branches*) in the Neon cloud during local work and deletes them when the containers are stopped.

### Orchestration & Infrastructure (Kubernetes)
* **Kubernetes (K8s)** – The production container orchestration system. It manages application scaling, monitors container health (via health checks), and ensures zero-downtime deployments.
* **Minikube** – A local, single-node Kubernetes cluster. It allows for testing K8s manifests, Helm charts, and application behavior within a cluster directly on your local machine.
* **Terraform** – An Infrastructure as Code (IaC) tool. It is used to declaratively define and automatically provision cloud infrastructure and the Kubernetes cluster.
* **Helm** – The package manager for Kubernetes. It defines the application structure using "Charts", making it easy to deploy, parameterize, and manage application versions within the cluster.

### Developer Tools & CI/CD
* **Warp** – A modern terminal equipped with AI capabilities, used to run development scripts (`npm run dev`), manage containers, and execute CLI commands (`git`, `kubectl`).
* **Git** – A distributed version control system used to track changes in the source code and configuration files.
* **GitHub** – The remote code repository platform used for team collaboration and source code hosting.
* **GitHub Actions** – The CI/CD (Continuous Integration / Continuous Deployment) automation tool. Upon every code push to GitHub, it automatically runs tests, executes the linter (ESLint), builds Docker images, and handles deployments to the Kubernetes cluster.
* **Postman** – An API testing tool. Used by developers and testers to send HTTP requests (POST, GET) to the application endpoints (e.g., signup, login) to verify correct behavioral functionality.

---

## 📂 Files

* `Dockerfile` - multi-stage image (development and production targets)
* `docker-compose.dev.yml` - app + Neon Local for local development
* `docker-compose.prod.yml` - app only (connects to Neon Cloud via env vars)
* `.env.development` - local development variables (Neon Local + app)
* `.env.production` - production variables (Neon Cloud URL)

---

## 1) Development (Neon Local + ephemeral branches)

Fill required values in `.env.development`:
* `NEON_API_KEY`
* `NEON_PROJECT_ID`
* `PARENT_BRANCH_ID` (ephemeral branches are created from this branch)

Start development stack:
```bash
docker compose -f docker-compose.dev.yml up --build
