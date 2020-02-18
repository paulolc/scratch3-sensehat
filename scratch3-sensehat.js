const ledmatrix = require('node-sense-hat').Leds;
const ScratchBridge = require('scratch3-bridge');

let s3b = new ScratchBridge();
let sender = 0;

ledmatrix.clear();
ledmatrix.setRotation(270);

let starting = true;
s3b.on('data', (msg,asender) =>{
    sender = asender;
    let values = msg;
    console.log(`values: (${sender})> ${values}`);

    if (!starting ){
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
        starting  = false;
    }
});

s3b.on('connect', ()=>{
    console.log('Connected!');
})

s3b.connect();

