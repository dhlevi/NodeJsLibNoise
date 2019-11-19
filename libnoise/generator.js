const Abs = require('./operator/abs.js');
const Add = require('./operator/add.js');
const Blend = require('./operator/blend.js');
const Clamp = require('./operator/clamp.js');
const Curve = require('./operator/curve.js');
const Displace = require('./operator/displace.js');
const Exponent = require('./operator/exponent.js');
const Invert = require('./operator/invert.js');
const Max = require('./operator/max.js');
const Min = require('./operator/min.js');
const Multiply = require('./operator/multiply.js');
const Power = require('./operator/pow.js');
const Rotate = require('./operator/rotate.js');
const ScaleBias = require('./operator/scaleBias.js');
const ScalePoint = require('./operator/scalePoint.js');
const Select = require('./operator/select.js');
const Subtract = require('./operator/subtract.js');
const Terrace = require('./operator/terrace.js');
const Translate = require('./operator/translate.js');
const Turbulence = require('./operator/turbulence.js');

// Helper class that makes it easier to string together a series of 
// Libnoise operators

var Generator = function(baseModule) 
{
	this.baseModule = baseModule;
};

Generator.prototype.getValue = function(x, y, z, scale)
{
    return this.baseModule.getValue(x, y, z, scale);
}

Generator.prototype.getModule = function() 
{
	return this.baseModule;
};

Generator.prototype.abs = function()
{
    return new Generator(new Abs(this.baseModule));
};

Generator.prototype.add = function(inbutB)
{
    return new Generator(new Add([this.baseModule, inbutB]));
};

Generator.prototype.blend = function(rightHand, controlModule)
{
    return new Generator(new Blend([this.baseModule, rightHand], controlModule));
};

Generator.prototype.clamp = function(lowerBound, upperBound)
{
    return new Generator(new Clamp(this.baseModule, lowerBound, upperBound));
};

Generator.prototype.curve = function(lowerBound, upperBound)
{
    return new Generator(new Curve(this.baseModule, lowerBound, upperBound));
};

Generator.prototype.displace = function(xModule, yModule, zModule)
{
    return new Generator(new Displace(this.baseModule, xModule, yModule, zModule));
};

Generator.prototype.exponent = function(exponent)
{
    return new Generator(new Exponent(this.baseModule, exponent));
};

Generator.prototype.invert = function()
{
    return new Generator(new Invert(this.baseModule));
};

Generator.prototype.max = function(rightHand)
{
    return new Generator(new Max([this.baseModule, rightHand]));
};

Generator.prototype.min = function(rightHand)
{
    return new Generator(new Min([this.baseModule, rightHand]));
};

Generator.prototype.multiply = function(rightHand)
{
    return new Generator(new Multiply([this.baseModule, rightHand]));
};

Generator.prototype.power = function(rightHand)
{
    return new Generator(new Power([this.baseModule, rightHand]));
};

Generator.prototype.rotate = function(xAngle, yAngle, zAngle)
{
    return new Generator(new Rotate(this.baseModule, xAngle, yAngle, zAngle));
};

Generator.prototype.scaleBias = function(scale, bias)
{
    return new Generator(new ScaleBias(this.baseModule, scale, bias));
};

Generator.prototype.scale = function(xScale, yScale, zScale)
{
    return new Generator(new ScalePoint(this.baseModule, xScale, yScale, zScale));
};

Generator.prototype.select = function(rightHand, controlModule, lowerBound, upperBound, falloff)
{
    return new Generator(new Select([this.baseModule, rightHand], controlModule, lowerBound, upperBound, falloff));
};

Generator.prototype.subtract = function(rightHand)
{
    return new Generator(new Subtract([this.baseModule, rightHand]));
};

Generator.prototype.terrace = function(controlPoints, invert)
{
    return new Generator(new Terrace(this.baseModule, controlPoints, invert));
};

Generator.prototype.translate = function(translateX, translateY, translateZ)
{
    return new Generator(new Translate(this.baseModule, translateX, translateY, translateZ));
};

Generator.prototype.turbulence = function(frequency, power, roughness, seed)
{
    return new Generator(new Turbulence(this.baseModule, frequency, power, roughness, seed));
};

module.exports = Generator;