var Perlin = require('../generator/perlin.js');

var Turbulence = function(sourceModule, frequency, power, roughness, seed) 
{
	this.xDistort = new Perlin();
	this.yDistort = new Perlin();
	this.zDistort = new Perlin();
	this.sourceModule = sourceModule || null;
	this.frequency    = frequency    || Perlin.DEFAULT_FREQUENCY;
	this.power        = power        || Turbulence.DEFAULT_POWER;
	this.roughness    = roughness    || Turbulence.DEFAULT_ROUGHNESS;
	this.seed         = seed         || Perlin.DEFAULT_SEED;
};

Turbulence.DEFAULT_POWER     = 1.0;
Turbulence.DEFAULT_ROUGHNESS = 3;

Turbulence.X0 = (12414.0 / 65536.0);
Turbulence.Y0 = (65124.0 / 65536.0);
Turbulence.Z0 = (31337.0 / 65536.0);
Turbulence.X1 = (26519.0 / 65536.0);
Turbulence.Y1 = (18128.0 / 65536.0);
Turbulence.Z1 = (60493.0 / 65536.0);
Turbulence.X2 = (53820.0 / 65536.0);
Turbulence.Y2 = (11213.0 / 65536.0);
Turbulence.Z2 = (44845.0 / 65536.0);
	
Turbulence.prototype = 
{
    get seed() 
    {
		return this.xDistort.seed;
	},
    set seed(v) 
    {
		this.xDistort.seed = v;
		this.yDistort.seed = v + 1;
		this.zDistort.seed = v + 2;
	},
	get frequency() 
	{
		return this.xDistort.frequency;
	},
	set frequency(v) 
	{
		this.xDistort.frequency = v;
		this.yDistort.frequency = v;
		this.zDistort.frequency = v;
	},
	get roughness() 
	{
		return this.xDistort.octaves;
	},
	set roughness(v) 
	{
		this.xDistort.octaves = v;
		this.yDistort.octaves = v;
		this.zDistort.octaves = v;
	},
    getValue: function(x, y, z, scale) 
    {
        if(!this.sourceModule) throw new Error('Invalid or missing source module!');

		x = parseFloat(x);
		y = parseFloat(y);
		z = parseFloat(z);

		var x0 = parseFloat(x + (12414.0 / 65536.0));
		var y0 = parseFloat(y + (65124.0 / 65536.0));
		var z0 = parseFloat(z + (31337.0 / 65536.0));
		var x1 = parseFloat(x + (26519.0 / 65536.0));
		var y1 = parseFloat(y + (18128.0 / 65536.0));
		var z1 = parseFloat(z + (60493.0 / 65536.0));
		var x2 = parseFloat(x + (53820.0 / 65536.0));
		var y2 = parseFloat(y + (11213.0 / 65536.0));
		var z2 = parseFloat(z + (44845.0 / 65536.0));

		var xd = x + (this.xDistort.getValue(x0, y0, z0, scale) * this.power);
        var yd = y + (this.yDistort.getValue(x1, y1, z1, scale) * this.power);
        var zd = z + (this.zDistort.getValue(x2, y2, z2, scale) * this.power);

        return this.sourceModule.getValue(xd, yd, zd, scale);
	}
};

module.exports = Turbulence;