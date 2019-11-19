const Controller  = require('./controller.js');
const NoiseFactory = require('./libnoise/noisefactory.js');
const { workerData, parentPort } = require('worker_threads');
const { req } = workerData;

parentPort.on('message', (msg) => 
{
    if (msg === 'next') 
    {
        console.log('Starting process...');
        processRequest(req)
        parentPort.postMessage({ req })
        parentPort.close();
    }
    throw new Error(`Unknown message: ${msg}`)
})

function processRequest(req)
{
    req.status = "In Progress...";

    try
    {
        var generators = Controller.createGenerators(req.request);
    
        // for now, assume the last generator is the "root" of the process
        var factory = new NoiseFactory();
        var data = req.type === 'spherical' ? factory.spherical(generators[generators.length - 1], req.width, req.height, req.minY, req.maxY, req.minX, req.maxX, req.isNormalized, req.scale)
                                            : factory.planar(generators[generators.length - 1], req.width, req.height, req.left, req.right, req.top, req.bottom, req.isSeamless, req.isNormalized, req.scale);

        req.results = data;

        req.status = "Complete";
    }
    catch(e)
    {
        req.status = "Failed: " + e;
    }
}