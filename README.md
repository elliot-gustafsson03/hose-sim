# Hose Simulation

This project aims to simulate the dynamics, in particular tensile force in an air muscle, of a concrete pump hose robot.

## Description

This application is a simple physics engine that can simulate particles affected by forces as well as links between these.

### Hose

The main object in this simulation is a rubber hose, that is being modeled as a chain of particles linked together with a stiffness factor.

### Air muscle

Another object that is being simulated is an air muscle, which has the objective of pulling on the hose to create bending. In this application the muscle is simply modeled as link connecting the hose to a fixed point, with the ability to set a desired length.

## Setup and usage

This project is written in Typescript and runs in a web browser.

### Requirements

To compile the project code, you are expected to have [Bun](https://bun.sh/) installed.

### Running the application

After cloning this repository, cd into the top directory and eun the following commands to install and run:

```bash
> bun install
> bun run dev
```

Then open [http://localhost:5173](http://localhost:5173) in a web browser where the application is running.

### Using the application

Certain settings, such as masses and stiffness factors, can be entered into the application page. More in-depth settings, such as dimensions, have to be updated through the source code.
