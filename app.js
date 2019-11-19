const express = require('express');
// our stuff
const Controller  = require('./controller.js');
const LibnoiseRequest  = require('./libnoiseRequest.js');
// other libs
const uuidv1 = require('uuid/v1');
const fs = require('fs');
const PImage = require('pureimage');

const app = express()
const port = 3000

app.use(express.urlencoded({extended: true})); 
app.use(express.json());  

// "in memory" database. Ideally you'd use a doc store for tracking submitted requests
// but this is fine for an example
app.post('/GenerateNoiseMap', function (req, res) 
{
    var id = uuidv1();
    var lnReq = new LibnoiseRequest(id, req.query, req.body.modules);
    Controller.requests[id] = lnReq;

    // this should be moved into a worker or external process so it doesn't spin forever
    Controller.processRequest(lnReq);

    res.json({ id: lnReq.id, status: lnReq.status, link: lnReq.link});
});

app.get('/GenerateNoiseMapResults/:id', function (req, res) 
{
    var id = req.params.id;
    if(Controller.requests.hasOwnProperty(id)) 
    {
        var libnoiseRequest = Controller.requests[id];
        if(libnoiseRequest.status == 'Complete')
        {
            if(libnoiseRequest.returnImage)
            {
                var img1 = PImage.make(libnoiseRequest.width, libnoiseRequest.height);
                var ctx = img1.getContext('2d');
            
                //loop through array and set the pixels. simple b/w heightmap
                for(var x = 0; x < libnoiseRequest.width; x++)
                {
                    for(var y = 0; y < libnoiseRequest.height; y++)
                    {
                        var val = libnoiseRequest.results[x][y];
                        
                        //val = val > 1 ? 1 : val < 0 ? 0 : val;
                        // vals will be 0.0 to 1.0, where 1.0 = 255
            
                        ctx.bitmap.setPixelRGBA_i(x, y, 255 * val, 255 * val, 255 * val, 255);
                    }
                }
            
                var fileName = uuidv1() + ".png";
                var tempStream = fs.createWriteStream(fileName);
                PImage.encodePNGToStream(img1, tempStream).then(() => 
                {
                    // read the temp file back up, then delete it
                    var s = fs.createReadStream(fileName);
                    
                    fs.unlink(fileName, (err) => 
                    {
                        if (err) throw err;
                        console.log(fileName + ' was deleted');
                    });

                    s.on('open', function () 
                    {
                        res.set('Content-Type', 'image/png');
                        s.pipe(res);
                    });
            
                    s.on('error', function () 
                    {
                        res.set('Content-Type', 'text/plain');
                        res.status(404).end('Not found');
                    });
            
                }).catch((e)=>
                {
                    console.log("there was an error writing");
                    throw new Error("there was an error creating the image");
                });
            }
            else res.json(libnoiseRequest.results)
        }
        else res.json(libnoiseRequest);
    }
    else res.json({ status: "error", message: "ID not found." });
});

app.delete('/GenerateNoiseMapResults/:id', function (req, res) {

    var id = req.params.id;
    if(Controller.requests.hasOwnProperty(id))
    {
        delete Controller.requests[id];
        res.json({ status: "Success", message: "Request deleted" });
    }
    else res.json({ status: "error", message: "ID not found." });
});

// cleanup the reqeusts
function cleanupRequests()
{
    // loop request keys. Any request older than 30 mins is deleted
    var keys = Object.keys(Controller.requests);
    var now = Date();
    for(var i = 0; i < keys.length; i++)
    {
        var id = keys[i];
        var req = Controller.requests[id];
        var date = new Date(req.date);
        
        date.setMinutes(date.getMinutes() + 30);

        if(date < now) delete Controller.requests[id];
    }

    setTimeout(cleanupRequests, 30000);
}

setTimeout(cleanupRequests, 30000);

app.listen(port, () => console.log(`listening on port ${port}!`));