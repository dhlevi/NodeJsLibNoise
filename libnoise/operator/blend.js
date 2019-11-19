var Interpolation = require('../interpolation.js');

var Blend = function(sourceModules, controlModule) 
{
	this.sourceModules = sourceModules || [];
	this.controlModule = controlModule || null;
};

Blend.prototype.getValue = function(x, y, z, scale )
{
    if(this.sourceModules.length < 2) throw new Error('Invalid or missing source module(s)!');
    if(!this.controlModule) throw new Error('Invalid or missing control module!');

	x = parseFloat(x);
	y = parseFloat(y);
	z = parseFloat(z);

	var a = this.sourceModules[0].getValue(x, y, z, scale);
	var b = this.sourceModules[1].getValue(x, y, z, scale);
	var c = (this.controlModule.getValue(x, y, z, scale) + 1.0) / 2.0;

	return Interpolation.interpolateLinear(a, b, c);
};

module.exports = Blend;