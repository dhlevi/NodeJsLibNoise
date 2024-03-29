var Min = function(sourceModules) 
{
	this.sourceModules = sourceModules || null;
};

Min.prototype.getValue = function(x, y, z, scale) 
{
    if(this.sourceModules.length < 2) throw new Error('Invalid or missing source module!');

    return Math.min
    (
		this.sourceModules[0].getValue(x, y, z, scale),
		this.sourceModules[1].getValue(x, y, z, scale)
	);
};

module.exports = Min;