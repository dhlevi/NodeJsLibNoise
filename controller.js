// LibNoise generators
const Billow = require('./libnoise/generator/billow.js');
const Checkerboard = require('./libnoise/generator/checkerboard.js');
const Const = require('./libnoise/generator/const.js');
const Perlin = require('./libnoise/generator/perlin.js');
const RidgedMulti = require('./libnoise/generator/ridgedmulti.js');
const Cylinders = require('./libnoise/generator/cylinders.js');
const Spheres = require('./libnoise/generator/spheres.js');
const Voronoi = require('./libnoise/generator/voronoi.js');
// LibNoise operators
const Abs = require('./libnoise/operator/abs.js');
const Add = require('./libnoise/operator/add.js');
const Blend = require('./libnoise/operator/blend.js');
const Clamp = require('./libnoise/operator/clamp.js');
const Curve = require('./libnoise/operator/curve.js');
const Displace = require('./libnoise/operator/displace.js');
const Exponent = require('./libnoise/operator/exponent.js');
const Invert = require('./libnoise/operator/invert.js');
const Max = require('./libnoise/operator/max.js');
const Min = require('./libnoise/operator/min.js');
const Multiply = require('./libnoise/operator/multiply.js');
const Power = require('./libnoise/operator/pow.js');
const Rotate = require('./libnoise/operator/rotate.js');
const ScaleBias = require('./libnoise/operator/scaleBias.js');
const ScalePoint = require('./libnoise/operator/scalePoint.js');
const Select = require('./libnoise/operator/select.js');
const Subtract = require('./libnoise/operator/subtract.js');
const Terrace = require('./libnoise/operator/terrace.js');
const Translate = require('./libnoise/operator/translate.js');
const Turbulence = require('./libnoise/operator/turbulence.js');

const NoiseFactory = require('./libnoise/noisefactory.js');

const { Worker, isMainThread, parentPort, workerData } = require('worker_threads');

var Controller = 
{
	createGenerators: function(modules)
    {
        var generators = [];
        for(var i = 0; i < modules.length; i++)
        {
            var genJson = modules[i];
            var generator;

            switch(genJson.type)
            {
                case 'billow':
                    generator = new Billow(genJson.frequency, genJson.lacunarity, genJson.persist, genJson.octaves, genJson.seed, genJson.quality);
                    break;
                case 'perlin':
                    generator = new Perlin(genJson.frequency, genJson.lacunarity, genJson.octaves, genJson.persist, genJson.seed, genJson.quality);
                    break;
                case 'const':
                    generator = new Const(geoJson.value);
                    break;
                case 'cylinders':
                    generator = new Cylinders(genJson.frequency);
                    break;
                case 'checkerboard':
                    generator = new Checkerboard();
                    break;
                case 'ridgedmulti':
                    generator = new RidgedMulti(genJson.frequency, genJson.lacunarity, genJson.octaves, genJson.seed, genJson.quality, genJson.offset, genJson.gain);
                    break;
                case 'spheres':
                    generator = new Spheres(genJson.frequency);
                    break;
                case 'voronoi':
                    generator = new Voronoi(genJson.frequency, genJson.displacement, genJson.distance, genJson.seed);
                    break;
                case 'abs':
                    generator = new Abs();
                    generator.inputs = genJson.inputs;
                    break;
                case 'add':
                    generator = new Add();
                    generator.inputs = genJson.inputs;
                    break;
                case 'blend':
                    generator = new Blend();
                    generator.inputs = genJson.inputs;
                    generator.control = genJson.control;
                    break;
                case 'clamp':
                    generator = new Clamp();
                    generator.inputs = genJson.inputs;
                    generator.lowerBound = genJson.lowerBound;
                    generator.upperBound = genJson.upperBound;
                    break;
                case 'curve':
                    generator = new Curve();
                    generator.inputs = genJson.inputs;
                    generator.controlPoints = genJson.controlPoints;
                    break;
                case 'displace':
                    generator = new Displace();
                    generator.inputs = genJson.inputs;
                    generator.xModule = genJson.xModule;
                    generator.yModule = genJson.yModule;
                    generator.zModule = genJson.zModule;
                    break;
                case 'exponent':
                    generator = new Exponent();
                    generator.inputs = genJson.inputs;
                    generator.exponent = genJson.exponent;
                    break;
                case 'invert':
                    generator = new Invert();
                    generator.inputs = genJson.inputs;
                    break;
                case 'max':
                    generator = new Max();
                    generator.inputs = genJson.inputs;
                    break;
                case 'min':
                    generator = new Min();
                    generator.inputs = genJson.inputs;
                    break;
                case 'multiply':
                    generator = new Multiply();
                    generator.inputs = genJson.inputs;
                    break;
                case 'power':
                    generator = new Power();
                    generator.inputs = genJson.inputs;
                    break;
                case 'rotate':
                    generator = new Rotate();
                    generator.inputs = genJson.inputs;
                    generator.xAngle = genJson.xAngle;
                    generator.yAngle = genJson.yAngle;
                    generator.zAngle = genJson.zAngle;
                    break;
                case 'scaleBias':
                    generator = new ScaleBias();
                    generator.inputs = genJson.inputs;
                    generator.scale = genJson.scale;
                    generator.bias = genJson.bias;
                    break;
                case 'scalePoint':
                    generator = new ScalePoint();
                    generator.inputs = genJson.inputs;
                    generator.xScale = genJson.xScale;
                    generator.yScale = genJson.yScale;
                    generator.zScale = genJson.zScale;
                    break;
                case 'select':
                    generator = new Select();
                    generator.inputs = genJson.inputs;
                    generator.control = genJson.control;
                    generator.lowerBound = genJson.lowerBound;
                    generator.upperBound = genJson.upperBound;
                    generator.fallOff = genJson.fallOff;
                    break;
                case 'subtract':
                    generator = new Subtract();
                    generator.inputs = genJson.inputs;
                    break;
                case 'terrace':
                    generator = new Terrace();
                    generator.inputs = genJson.inputs;
                    generator.controlPoints = genJson.controlPoints;
                    generator.invert = genJson.invert;
                    break;
                case 'translate':
                    generator = new Translate();
                    generator.inputs = genJson.inputs;
                    generator.translateX = genJson.translateX;
                    generator.translateY = genJson.translateY;
                    generator.translateZ = genJson.translateZ;
                    break;
                case 'turbulence':
                    generator = new Turbulence();
                    generator.inputs = genJson.inputs;
                    generator.frequency = genJson.frequency;
                    generator.power = genJson.power;
                    generator.roughness = genJson.roughness;
                    generator.seed = genJson.seed;
                    break;
            }

            generator.id = genJson.id;
            generators.push(generator);
            // basic model:
            // { id: '', type: '', inputs: [] att: ##}
        }
        
        // Cycle through generators and apply any input modules based on their ID's
        // we can't do it above because generators may be insterted in a random order
        for(var i = 0; i < generators.length; i++)
        {
            var generator = generators[i];
            if(generator.hasOwnProperty('inputs') && generator.hasOwnProperty('sourceModule'))
            {
                for(var j = 0; j < generators.length; j++)
                {
                    if(generators[j].id == generator.inputs)
                    {
                        generator.sourceModule = generators[j];
                        break;
                    }
                }
            }
            
            if(generator.hasOwnProperty('inputs') && generator.hasOwnProperty('sourceModules'))
            {
                var sourceModules = [];

                for(var j = 0; j < generators.length; j++)
                {
                    if(generators[j].id == generator.inputs[0])
                    {
                        sourceModules[0] = generators[j];
                    }
                    else if(generators[j].id == generator.inputs[1])
                    {
                        sourceModules[1] = generators[j];
                    }

                    if(sourceModules[0] && sourceModules[1]) break;
                }

                generator.sourceModules = sourceModules;
            }

            if(generator.hasOwnProperty('control') && generator.hasOwnProperty('controlModule'))
            {
                for(var j = 0; j < generators.length; j++)
                {
                    if(generators[j].id == generator.control)
                    {
                        generator.controlModule = generators[j];
                        break;
                    }
                }
            }
        }

        return generators;
    },
    processRequest: function(req) // could use worker to run the process async.
    {
        var worker = new Worker('./requestWorker.js', { workerData: { req }});
        worker.on("error", code => new Error(`Worker error with exit code ${code}`));
        worker.on('message', callback)
        worker.on("exit", code =>
            console.log(`Worker stopped with exit code ${code}`)
        );

        worker.postMessage('next');
    },
    requests: {}
};

function callback (data) 
{
    Controller.requests[data.req.id] = data.req;

    console.log("Processing complete");
    this.removeListener('message', callback)
    this.unref()
}

module.exports = Controller;