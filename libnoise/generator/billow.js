const utils  = require('../utils.js');

var Billow = function(frequency, lacunarity, persist, octaves, seed, quality) 
{
	this.frequency  = frequency  || Billow.DEFAULT_FREQUENCY;
	this.lacunarity = lacunarity || Billow.DEFAULT_LACUNARITY;
	this.octaves    = octaves    || Billow.DEFAULT_OCTAVE;
	this.persist    = persist    || Billow.DEFAULT_PERSISTENCE;
	this.seed       = seed       || Billow.DEFAULT_SEED;
	this.quality    = quality    || utils.QUALITY_STD;
};

Billow.DEFAULT_FREQUENCY = 1.0;
Billow.DEFAULT_LACUNARITY = 2.0;
Billow.DEFAULT_OCTAVE = 5;
Billow.DEFAULT_PERSISTENCE = 0.5;
Billow.DEFAULT_SEED = 0;
Billow.MAX_OCTAVE = 30;
		
Billow.prototype.getValue = function(x, y, z, scale) 
{
	if(!scale) scale = 1;
	
	var value = 0.0;
	var curp = 1.0;

	x *= this.frequency;
	y *= this.frequency;
	z *= this.frequency;

	for (var i = 0; i < this.octaves + scale; i++)
	{
		var nx = utils.makeInt32Range(x);
		var ny = utils.makeInt32Range(y);
		var nz = utils.makeInt32Range(z);
		var modSeed = (this.seed + i) & 0xffffffff;
		var signal = utils.gradientCoherentNoise3D(nx, ny, nz, modSeed, this.quality);

		signal = 2.0 * Math.abs(signal) - 1.0;
		
		value += signal * curp;

		x *= this.lacunarity;
		y *= this.lacunarity;
		z *= this.lacunarity;

		curp *= this.persist;
	}

	return value + 0.5;
};

module.exports = Billow;