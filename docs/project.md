# Updated Project: Full-Stack ToDo Notes Application on AWS ECS Fargate

## Project Objective

Build and deploy a ToDo Notes application:

- Backend (Node.js + Express): CRUD API for notes (GET, POST, PUT, DELETE)
- Frontend (React): User interface to create, update, delete, and view notes
- Containerize both frontend and backend with Docker
- Deploy on AWS ECS Fargate using Terraform
- Use Docker Hub as the container registry
- Implement CI/CD with GitHub Actions for automated build, push, and deployment
- Enable CloudWatch logging for monitoring

## Updated Project Requirements

### 1. Backend (Node.js + Express)

**Endpoints:**

- GET /api/notes → List all notes
- POST /api/notes → Add a new note
- PUT /api/notes/:id → Update a note
- DELETE /api/notes/:id → Delete a note

**Data storage:**

- Simple in-memory store for the weekend (or optional lightweight DB like SQLite/Postgres)

**Container:**

- Dockerized, expose port 5000

### 2. Frontend (React)

- Display a list of notes
- Form to add/edit notes
- Buttons to delete notes
- Connect to backend API
- Dockerized with Nginx, expose port 80

### 3. Infrastructure (Terraform + AWS ECS Fargate)

- VPC: Public and private subnets
- Security Groups:
  - Frontend: HTTP/HTTPS open
  - Backend: Accessible only by frontend (or via ALB)
- ECS Cluster: Separate Fargate services for frontend and backend
- Task Definitions: CPU/memory, container images, logging
- ALB: Route traffic to frontend (and optionally backend if exposed externally)
- IAM Roles: ECS Task Roles for CloudWatch logging
- CloudWatch: Logs from both frontend and backend

### 4. CI/CD (GitHub Actions)

- Build and push Docker images to Docker Hub
- Terraform plan and apply to update ECS services

**Secrets:**

- DOCKERHUB_USERNAME / DOCKERHUB_TOKEN
- AWS_ACCESS_KEY_ID / AWS_SECRET_ACCESS_KEY

### 5. Deliverables

- Dockerized full-stack ToDo Notes app
- Terraform code for ECS Fargate infrastructure
- GitHub Actions workflow for CI/CD
- CloudWatch logging enabled
- README with architecture diagram, deployment steps, repo & Docker Hub links
- Publicly accessible app via ALB

## Updated Weekend Roadmap

### Day 1 – Application & Docker Setup

**Backend**

- Build Node.js CRUD API for notes
- Dockerize backend, test locally
- Push image to Docker Hub  
  Time: 2–3 hours

**Frontend**

- Build React UI for note CRUD
- Dockerize with Nginx, test locally
- Push image to Docker Hub  
  Time: 2–3 hours

### Day 2 – Infrastructure & Deployment

**Terraform Setup**

- VPC, Security Groups, ECS cluster, ALB, IAM roles, task definitions
- Deploy Fargate services with backend and frontend containers from Docker Hub  
  Time: 3–4 hours

**CloudWatch Logging**

- Enable logs for backend and frontend ECS tasks  
  Time: 30 min

**GitHub Actions CI/CD**

- Build and push images
- Terraform apply to update ECS  
  Time: 2 hours

**Testing & Documentation**

- Verify frontend can call backend API
- Check CloudWatch logs
- Create README with architecture diagram, deployment steps  
  Time: 1 hour

### Optional Enhancements

- Add persistent storage (RDS/Postgres) for notes
- Enable HTTPS via ALB and ACM
- Auto-scaling for ECS tasks
