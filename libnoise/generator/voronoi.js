const utils  = require('../utils.js');

var Voronoi = function(frequency, displacement, distance, seed)
{
	this.frequency    = frequency    || Voronoi.DEFAULT_FREQUENCY;
	this.displacement = displacement || Voronoi.DEFAULT_DISPLACEMENT;
	this.distance     = distance     || false;
	this.seed         = seed         || Voronoi.DEFAULT_SEED;
};

Voronoi.DEFAULT_DISPLACEMENT    = 1.0;
Voronoi.DEFAULT_FREQUENCY       = 1.0;
Voronoi.DEFAULT_SEED            = 0;

Voronoi.prototype.getValue = function(x, y, z) 
{
	x *= this.frequency;
	y *= this.frequency;
	z *= this.frequency;

	var xi = parseInt(x > 0.0 ? x : x - 1);
	var iy = parseInt(y > 0.0 ? y : y - 1);
	var iz = parseInt(z > 0.0 ? z : z - 1);

	var md = 2147483647.0;

	var xc = 0;
	var yc = 0;
	var zc = 0;

	for (var zcu = iz - 2; zcu <= iz + 2; zcu++)
	{
		for (var ycu = iy - 2; ycu <= iy + 2; ycu++)
		{
			for (var xcu = xi - 2; xcu <= xi + 2; xcu++)
			{
				var xp = xcu + utils.valueNoise3D(xcu, ycu, zcu, this.seed);
				var yp = ycu + utils.valueNoise3D(xcu, ycu, zcu, this.seed + 1);
				var zp = zcu + utils.valueNoise3D(xcu, ycu, zcu, this.seed + 2);
				var xd = xp - x;
				var yd = yp - y;
				var zd = zp - z;
				var d = xd * xd + yd * yd + zd * zd;

				if (d < md)
				{
					md = d;
					xc = xp;
					yc = yp;
					zc = zp;
				}
			}
		}
	}

	var v;

	if (this.distance)
	{
		var xd = xc - x;
		var yd = yc - y;
		var zd = zc - z;

		v = (Math.sqrt(xd * xd + yd * yd + zd * zd)) * utils.SQRT_3 - 1.0;
	} 
	else
	{
		v = 0.0;
	}

	return v + (this.displacement * utils.valueNoise3D((Math.floor(xc)), (Math.floor(yc)), (Math.floor(zc)), 0));
};

module.exports  = Voronoi;