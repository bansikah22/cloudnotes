# Amazon ECS Overview and Object Relationships

## What is Amazon ECS?

Amazon ECS (Elastic Container Service) is a fully managed container orchestration service provided by AWS.  
It manages how your Docker containers are defined, deployed, scaled, and maintained.

The main objects in ECS are:  
**Cluster → Service → Task Definition → Tasks → Containers**

## ECS Task Definition

- A blueprint that describes how containers should be deployed
- Unique to ECS
- Defines how much CPU and memory a container will use
- Specifies image, ports, environment variables, volumes, and other runtime settings
- Essentially contains the same configuration you normally place in a `docker-compose.yml` file

**Important Note:**  
Port mapping in ECS (especially with `awsvpc` network mode on Fargate) **must map the same port to the same port** (e.g., `3000:3000`).  
Mappings like `3000:3001` **will not work** because ECS does not allow arbitrary host-to-container remapping in this mode.

## A Task

- An instance of a Task Definition
- Represents a running copy of your application
- The Task contains one or more running containers defined by the Task Definition

## ECS Service

- Ensures that a specified number of Tasks are running at all times
- Automatically restarts tasks if they crash or exit
- If an EC2 instance fails (in EC2 mode), the service reschedules tasks on healthy instances
- Supports integration with load balancers to distribute traffic across tasks

## ECS Load Balancers

- An Application Load Balancer (ALB) can be assigned to an ECS Service
- It routes external traffic to tasks through a Target Group
- The ECS service automatically registers and deregisters tasks to the Target Group

## ECS Flow Diagram

```mermaid
flowchart TB

%% ALB block
subgraph ALB_Block["Application Load Balancer"]
  ALB_node["ALB"]
  TG_node["Target Group"]
end

%% ECS nested boxes
subgraph ECS_Cluster["ECS Cluster"]
  subgraph Service_Box["ECS Service"]
    TaskDef_node["Task Definition"]
    subgraph Task_Box["Running Task (Fargate)"]
      Task_node["Task Instance"]
      Container_node["Container (Docker Image)"]
    end
  end
end

%% Connections (flow)
ALB_node --> TG_node
TG_node --> TaskDef_node
TaskDef_node --> Task_node
Task_node --> Container_node

%% Styling
classDef alb fill:#d9f0ff,stroke:#3b82f6,stroke-width:1.5px,color:#1e3a8a;
classDef tg  fill:#edf2f7,stroke:#475569,stroke-width:1.2px,color:#334155;
classDef ecs fill:#e8f0fe,stroke:#1d4ed8,stroke-width:1.5px,color:#1e3a8a;
classDef service fill:#e8fdf5,stroke:#059669,stroke-width:1.5px,color:#065f46;
classDef taskdef fill:#ffefef,stroke:#dc2626,stroke-width:1.5px,color:#7f1d1d;
classDef task fill:#fff9db,stroke:#d97706,stroke-width:1.5px,color:#92400e;
classDef container fill:#f8e8ff,stroke:#9333ea,stroke-width:1.5px,color:#581c87;

class ALB_node alb
class TG_node tg
class TaskDef_node taskdef
class Task_node task
class Container_node container
class Service_Box service
class ECS_Cluster ecs
