var Max = function(sourceModules) 
{
	this.sourceModules = sourceModules || null;
};

Max.prototype.getValue = function(x, y, z, scale) 
{
    if(!this.sourceModules.length < 2) throw new Error('Invalid or missing source module!');

    return Math.max
    (
		this.sourceModules[0].getValue(x, y, z, scale),
		this.sourceModules[1].getValue(x, y, z, scale)
	);
};

module.exports = Max;