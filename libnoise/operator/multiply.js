var Multiply = function(sourceModules) 
{
	this.sourceModules = sourceModules || null;
};

Multiply.prototype.getValue = function(x, y, z, scale) 
{
    if(!this.sourceModules.length < 2) throw new Error('Invalid or missing source module!');

	return this.sourceModules[0].getValue(x, y, z, scale) * this.sourceModules[1].getValue(x, y, z, scale);
};

module.exports = Multiply;