const utils  = require('../utils.js');

var RidgedMulti = function(frequency, lacunarity, octaves, seed, quality, offset, gain) 
{
	this.frequency  = frequency  || RidgedMulti.DEFAULT_FREQUENCY;
	this.lacunarity = lacunarity || RidgedMulti.DEFAULT_LACUNARITY;
	this.octaves    = octaves    || RidgedMulti.DEFAULT_OCTAVE;
	this.seed       = seed       || RidgedMulti.DEFAULT_SEED;
	this.quality    = quality    || utils.QUALITY_STD;
	this.offset     = offset     || RidgedMulti.DEFAULT_OFFSET;
    this.gain       = gain       || RidgedMulti.DEFAULT_GAIN;
    this.weights    = [];
};

RidgedMulti.DEFAULT_FREQUENCY = 1.0;
RidgedMulti.DEFAULT_LACUNARITY = 1.0;
RidgedMulti.DEFAULT_OCTAVE = 5;
RidgedMulti.DEFAULT_SEED = 0;
RidgedMulti.DEFAULT_OFFSET = 1.0;
RidgedMulti.DEFAULT_GAIN = 2.0;
RidgedMulti.MAX_OCTAVE = 30;

RidgedMulti.prototype = 
{
	updateWeights: function()
	{
		var h = 1.0;
		var frequency = 1.0;

		this.weights = [];

        for (var i = 0; i < RidgedMulti.MAX_OCTAVE; i++) 
        {
			this.weights[i] = Math.pow(frequency, -h);
			frequency *= this.lacunarity;
		}
	},
    get lacunarity() 
    {
		return this._lacunarity;
	},
    set lacunarity(v) 
    {
		this._lacunarity = v;
		this.updateWeights();
	},
    getValue: function(x, y, z, scale) 
    {
        if(!scale) scale = 1;

		x *= this.frequency;
        y *= this.frequency;
        z *= this.frequency;

        var value = 0.0;
        var weight = 1.0;

        for (var i = 0; i <this.octaves + scale; i++)
        {
            var nx = utils.makeInt32Range(x);
            var ny = utils.makeInt32Range(y);
            var nz = utils.makeInt32Range(z);

            var modSeed = (this.seed + i) & 0x7fffffff;
            var signal = utils.gradientCoherentNoise3D(nx, ny, nz, modSeed, this.quality);

            signal = Math.abs(signal);
            signal = this.offset - signal;
            signal *= signal;
            signal *= weight;

            weight = signal * this.gain;
            weight = utils.clampValue(weight, 0.0, 1.0);

            value += (signal * this.weights[i]);

            x *= this.lacunarity;
            y *= this.lacunarity;
            z *= this.lacunarity;
        }

		return (value * 1.25) - 1.0;
	}
};

module.exports = RidgedMulti;