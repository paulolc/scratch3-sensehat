const sensehat = require('node-sense-hat');
const ledmatrix = sensehat.Leds;
const imu = sensehat.Imu;
const ScratchBridge = require('scratch3-bridge');
let sensehatreadings = [];

let sender = "00000";
let started = false;

const IMU_POLLING_INTERVAL_IN_MS = 100;
const PERIODIC_DATA_SEND_IN_MS = 2000;
const SPLASH_MSG = `

scratch3-sensehat v1.0

Companion utility for the SenseHAT Led Matrix Editor MIT Scratch project
- ©paulolc 2020

This utility alongside your remixed MIT Scratch 3 project 
SenseHAT Led Matrix Editor will allow you to paint the 
leds on the Raspberry Pi SenseHAT led matrix display from 
Scratch 3 Online and without any Scratch extensions!

It's required to:
- Run this utility on a Raspberry Pi with a SenseHAT attached.
- From an MIT Scratch account with "Scratcher" status, "Remix" 
and run the SenseHAT Led Matrix Editor MIT Scratch project.

You will be requested for:

1. Entering your Scratch credentials (only on the first run) 
2. Choose your Remixed Scratch SenseHAT Led Matrix Editor 
project from the prompt's project listing.

`;

console.log(SPLASH_MSG);

console.log("- Checking Raspberry Pi SenseHAT ...\n")
const IMU = new imu.IMU();
ledmatrix.clear();
ledmatrix.setRotation(270);

console.log("\n - Connecting to Scratch Online...\n");
console.log("(Authenticate if needed and choose your remixed Scratch SenseHAT Led Matrix Editor project from the listing)\n");
console.log('Press any key to continue.');
process.stdin.once('data', ()=>{
    let s3b = new ScratchBridge();
    s3b.on('data', (msg, asender) =>{
        sender = ( asender ? asender : sender );
        let values = msg;
        console.log(`values: (${asender})> ${values}`);
    
        if ( started ){
            if(!values){
                ledmatrix.clear();
                return;
            }
            let data = values.map( x => parseInt(x) );
            
            let row = 8 - Math.ceil( data[0] / 8 ) ;
            let column = (data[0] - 1) % 8  ;
            let rgbcolor = [ data[1] ,data[2], data[3] ];
    
            ledmatrix.setPixel( row , column, rgbcolor );
        } else {
            console.log(`Checking if the message received is the handshake from the Scratch project. ( ${sender}: ${msg} )`);
            if( msg.toString() === sender.substr(0,5) ) {
                console.log(`Handshake message has been received. Sending sensor data has STARTED! `);
                started = true;
            }
        }
    });
    
    s3b.on('connect', ()=>{
        console.log('Connected!');
        console.log(`Waiting for the handshake message from the Scratch project...`);
        const sendreadings = setInterval(() => {
            if(started){
                console.log(`Sending data to ${sender}: '${sensehatreadings}'`)
                s3b.send(sender,['START'].concat( sensehatreadings ));
            }
        }, PERIODIC_DATA_SEND_IN_MS);
        
    })
    
    s3b.connect();    
});

const flattendata = function( data ){
    return Object.values(data).reduce( ( accumulator, obj ) => {
        const acc = ( typeof accumulator === "object" ? Object.values(accumulator) : [ accumulator ] );
        const values = ( typeof obj === "object" ? Object.values(obj) : obj );
        return acc.concat(values);
   });
}

const round = function( decimals ){
    return  val => Math.round((val + Number.EPSILON) * Math.pow(10,decimals)) / Math.pow(10,decimals) ;
}

const imupolling = setInterval( () => {
    IMU.getValue((err, data) => {
        if (err !== null) {
          console.error("Could not read sensor data: ", err);
          clearInterval(imupolling);
          return;
        }
        const ts = data.timestamp;
        delete data.timestamp;
        sensehatreadings = flattendata( data ).map( round(3) );
        sensehatreadings = [ts].concat( sensehatreadings );//.slice(Math.max(sensehatreadings.length - 3, 0)));
    });
}, IMU_POLLING_INTERVAL_IN_MS );


