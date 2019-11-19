var Invert = function(sourceModule) 
{
	this.sourceModule = sourceModule || null;
};

Invert.prototype.getValue = function(x, y, z, scale) 
{
    if(!this.sourceModule) throw new Error('Invalid or missing source module!');

	return -this.sourceModule.getValue(x, y, z, scale);
};

module.exports = Invert;