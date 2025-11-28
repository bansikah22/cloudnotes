### ECS Task Definition

- A Blueprint that describes how containers should be deployed
- Perculiar to ECS
- Contains the config for How much CPU/MEM should be allocated per containers or how much cpu/mem they will use
- What Image/Ports/Volumes it should use

`Note`: port mapping on ECS is done by mapping same port to another eg port `3000:3000` , wrong will be port `3000:3001` which will not work
- It basically contains the configuration that we always have in our normal docker-compose.yaml files

### A Task
  - An instance of a Task Definition(An instance of our application).
  - A running container(s) with the settings defined in the Task definition.
 
 ### ECS service
  - A service ensures that a certain number ot Tasks are running at all times.
  - Restarts containers that have exited/crashed
  - EC2 instance fails, the service will restart task on a working EC2 isntance
 
  ### ECS Load Balancers
  - A Load Balancer can be assigned to `route` external traffic to your service
    
  
