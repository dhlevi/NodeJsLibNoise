const utils  = require('../utils.js');

var Perlin = function(frequency, lacunarity, octaves, persist, seed, quality) 
{
	this.frequency  = frequency  || Perlin.DEFAULT_FREQUENCY;
	this.lacunarity = lacunarity || Perlin.DEFAULT_LACUNARITY;
	this.octaves    = octaves    || Perlin.DEFAULT_OCTAVE;
	this.persist    = persist    || Perlin.DEFAULT_PERSISTENCE;
	this.seed       = seed       || Perlin.DEFAULT_SEED;
	this.quality    = quality    || utils.QUALITY_STD;
};
		
Perlin.DEFAULT_FREQUENCY = 1.0;
Perlin.DEFAULT_LACUNARITY = 1.0;
Perlin.DEFAULT_OCTAVE = 5;
Perlin.DEFAULT_PERSISTENCE = 0.5;
Perlin.DEFAULT_SEED = 0;
Perlin.MAX_OCTAVE = 30;

Perlin.prototype.getValue = function(x, y, z, scale) 
{
	if(!scale) scale = 1;
	
	var value = 0.0;
	var cp = 1.0;

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

		value += signal * cp;

		x *= this.lacunarity;
		y *= this.lacunarity;
		z *= this.lacunarity;

		cp *= this.persist;
	}

	return value;
};

module.exports = Perlin