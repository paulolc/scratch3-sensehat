# scratch3-sensehat
Companion app to use with your Scratch 3 projects, that enables the programming of the Raspberry Pi Sense Hat using MIT Scratch 3 Online!

At the moment there isn't any extension available in Scratch Online to control the Raspberry Pi with a Sense Hat. There is one but it's for Scratch 3 Offline so it means that you'll not be able to share your projects with the Community.

Based on the scratch3-bridge

This app will send The SenseHAT sensor data to your designated Scratch 3 project and receive orders to paint the specific pixels from it.

# Requirements

## To Run:
- Raspberry Pi
- SenseHAT
- Internet access on the Raspberry Pi
- Scratch 3 online project clone of the 
- You'll need to be a Scratcher (If you are a "New Scratcher" you won't be able to run this. Check how to become a Scratcher)

## To Build:
- Raspberry Pi with:
  - node v8.16 installed (maybe other versions of node will do too)
  - makeself installed
  - pkg installed

# Install&Run

On Scratch Online:

1. "Remix" the MIT Scratch project [SenseHAT Led Matrix Editor](https://scratch.mit.edu/projects/365197866/)
2. Click the green flag

On the Raspberry Pi:

3. Download the Raspberry Pi compatible binary from this project Releases
4. Run it from the command line and answer the prompts

After no longer than 10s, you should start seeing the values of the Raspberry Pi SenseHAT sensors changing on the sensor data panel on the Scratch project. If you click the pixel squares on the Scratch Matrix Editor project you'll be able to see them changing on the Raspberry Pi SenseHAT led pixels display!

## Using node.js

1. Download and install node v8.16.0 (other versions may work too)
2. Clone this repository
3. Change to the newly downloaded repo directory
4. run npm install
5. run node scratch3-sensehat.js

# Build

For the prerequisites, check the Requirements To Build section above.

1. Clone this repository
2. Change to the downloaded directory
3. Run 'make'
4. The scratch3-sensehat binary will be on the newly created target directory





