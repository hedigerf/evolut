# evolut

Design of artificial animals with evolutionary alogrithms.

## Installation

To install the application and it's dependencies with ease npm is required.
Npm is bundled with the installation of nodejs [nodejs.org](https://nodejs.org/en/).
We recommend installing nodejs version 6 and above.

```bash
cd /path/to/project/evolutjs
npm install
npm start
```

## Configuration

The main configuration is in config/default.json.
All aspects of this application from threading, simulation, etc. are adjustable.
Properties of the evolutionary algorithm may be defined in config/mutaion.json.

We recommend using about 15 individuals per simulation process.
This number was evaluated on high-end systems.
Therefore lower-end systems may need to adapt.

For a complete configuration see evolutjs/src/app/defaultConfig.js.

## Headless

On linux systems the rendering can be done in a headless client.
This is especially useful for server environments.
The requirement is xvfb (a virtual x frame buffer).

### Fedora

```bash
sudo dnf install xorg-x11-server-Xvfb
xvfb-run npm start
```
