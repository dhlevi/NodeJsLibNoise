var ScaleBias = function(sourceModule, scale, bias) 
{
	this.sourceModule = sourceModule || null;
	this.scale        = scale        || ScaleBias.DEFAULT_SCALE;
	this.bias         = bias         || ScaleBias.DEFAULT_BIAS;
};

ScaleBias.DEFAULT_BIAS  = 0.0;
ScaleBias.DEFAULT_SCALE = 1.0;

ScaleBias.prototype.getValue = function(x, y, z, scale) 
{
    if(!this.sourceModule) throw new Error('Invalid or missing source module!');

	return this.sourceModule.getValue(x, y, z, scale) * this.scale + this.bias;
};

module.exports = ScaleBias;