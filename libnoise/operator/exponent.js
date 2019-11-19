var Exponent = function(sourceModule, exponent) 
{
	this.sourceModule = sourceModule || null;
	this.exponent     = exponent     || 1
};

Exponent.prototype.getValue = function(x, y, z, scale) 
{
    if(!this.sourceModule) throw new Error('Invalid or missing source module!');

	return Math.pow(Math.abs((this.sourceModule.getValue(x, y, z, scale) + 1.0) / 2.0), this.exponent) * 2.0 - 1.0;
};

module.exports = Exponent;