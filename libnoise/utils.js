var Interpolation   = require('./interpolation.js');
var VectorTable     = require('./vectortable.js');

var	NoiseGenerator =
{
	PI: Math.PI,
	SQRT_2: Math.SQRT2,
	SQRT_3: 1.7320508075688772935,
	DEG_TO_RAD: Math.PI / 180.0,
	RAD_TO_DEG:  1.0 / (Math.PI / 180.0),

	X_NOISE_GEN: 1619,
	Y_NOISE_GEN: 31337,
	Z_NOISE_GEN: 6971,
	SEED_NOISE_GEN: 1013,
	SHIFT_NOISE_GEN: 8,
	QUALITY_FAST: 0,
	QUALITY_STD: 1,
	QUALITY_BEST: 2,

	intValueNoise3D: function(x, y, z, seed) 
	{
		x = parseInt(x);
		y = parseInt(y);
		z = parseInt(z);
		seed = parseInt(seed);

		// All constants are primes and must remain prime in order for this noise
		// function to work correctly.
		var n = parseInt((
			NoiseGenerator.X_NOISE_GEN * x
			+ NoiseGenerator.Y_NOISE_GEN * y
			+ NoiseGenerator.Z_NOISE_GEN * z
			+ NoiseGenerator.SEED_NOISE_GEN * seed)
			& 0x7fffffff
		);

		n = (n >> 13) ^ n;

		return parseFloat((n * (n * n * 60493 + 19990303) + 1376312589) & 0x7fffffff);
	},
	valueNoise3D: function(x, y, z, seed) 
	{
		return 1.0 - (NoiseGenerator.intValueNoise3D(parseInt(x), parseInt(y), parseInt(z), parseInt(seed)) / 1073741824.0);
	},
	gradientNoise3D: function(fx, fy, fz, ix, iy, iz, seed) 
	{
		if(!seed) seed = 1;

		fx = parseFloat(fx);
		fy = parseFloat(fy);
		fz = parseFloat(fz);
		ix = parseFloat(ix);
		iy = parseFloat(iy);
		iz = parseFloat(iz);

		// Randomly generate a gradient vector given the integer coordinates of the
		// input value.  This implementation generates a random number and uses it
		// as an index into a normalized-vector lookup table.
		var vectorIndex = parseInt(
			NoiseGenerator.X_NOISE_GEN * ix +
			NoiseGenerator.Y_NOISE_GEN * iy +
			NoiseGenerator.Z_NOISE_GEN * iz +
			NoiseGenerator.SEED_NOISE_GEN * seed
		) & 0xffffffff;

		vectorIndex ^= (vectorIndex >> NoiseGenerator.SHIFT_NOISE_GEN);
		vectorIndex &= 0xff;

		var xvGradient = VectorTable[(vectorIndex << 2)];
		var yvGradient = VectorTable[(vectorIndex << 2) + 1];
		var zvGradient = VectorTable[(vectorIndex << 2) + 2];

		// Set up us another vector equal to the distance between the two vectors
		// passed to this function.
		var xvPoint = (fx - ix);
		var yvPoint = (fy - iy);
		var zvPoint = (fz - iz);

		// Now compute the dot product of the gradient vector with the distance
		// vector.  The resulting value is gradient noise.  Apply a scaling value
		// so that this noise value ranges from -1.0 to 1.0.
		return ((xvGradient * xvPoint) + (yvGradient * yvPoint) + (zvGradient * zvPoint)) * 2.12;
	},
	coherentNoise3D: function(x, y, z, seed, quality, func) 
	{
		if(!func) throw new Error('Must provide proper interpolation function!');

		x = parseFloat(x);
		y = parseFloat(y);
		z = parseFloat(z);

		seed = !seed ? 1 : parseInt(seed);
		quality = !quality ? quality = NoiseGenerator.QUALITY_STD : parseInt(quality);

		var xi = parseInt(x);
		var yi = parseInt(y);
		var zi = parseInt(z);

		// Create a unit-length cube aligned along an integer boundary.  This cube
		// surrounds the input point.
		var x0 = parseFloat(x > 0.0 ? xi : x - 1);
		var x1 = x0 + 1;
		var y0 = parseFloat(y > 0.0 ? yi : y - 1);
		var y1 = y0 + 1;
		var z0 = parseFloat(z > 0.0 ? zi : z - 1);
		var z1 = z0 + 1;

		// Map the difference between the coordinates of the input value and the
		// coordinates of the cube's outer-lower-left vertex onto an S-curve.
		var xs = 0, ys = 0, zs = 0;

		switch (quality) 
		{
			case this.QUALITY_BEST:
				xs = Interpolation.mapQuinticSCurve(x - x0);
				ys = Interpolation.mapQuinticSCurve(y - y0);
				zs = Interpolation.mapQuinticSCurve(z - z0);
				break;
			case this.QUALITY_STD:
				xs = Interpolation.mapCubicSCurve(x - x0);
				ys = Interpolation.mapCubicSCurve(y - y0);
				zs = Interpolation.mapCubicSCurve(z - z0);
				break;
			default:
			case this.QUALITY_FAST:
				xs = x - x0;
				ys = y - y0;
				zs = z - z0;
				break;
		}
		// use provided function to interpolate
		return func(x0, y0, z0, x1, y1, z1, xs, ys, zs);
	},
	valueCoherentNoise3D: function(x, y, z, seed, quality) 
	{
		return coherentNoise3D(x, y, z, seed, quality, function(x0, y0, z0, x1, y1, z1, xs, ys, zs) 
		{
			// Now calculate the noise values at each vertex of the cube.  To generate
			// the coherent-noise value at the input point, interpolate these eight
			// noise values using the S-curve value as the interpolant (trilinear
			// interpolation.)
			var n0, n1, ix0, ix1, iy0, iy1;

			n0   = NoiseGenerator.valueNoise3D(x0, y0, z0, seed);
			n1   = NoiseGenerator.valueNoise3D(x1, y0, z0, seed);
			ix0  = Interpolation.interpolateLinear(n0, n1, xs);
			n0   = NoiseGenerator.valueNoise3D(x0, y1, z0, seed);
			n1   = NoiseGenerator.valueNoise3D(x1, y1, z0, seed);
			ix1  = Interpolation.interpolateLinear(n0, n1, xs);
			iy0  = Interpolation.interpolateLinear(ix0, ix1, ys);
			n0   = NoiseGenerator.valueNoise3D(x0, y0, z1, seed);
			n1   = NoiseGenerator.valueNoise3D(x1, y0, z1, seed);
			ix0  = Interpolation.interpolateLinear(n0, n1, xs);
			n0   = NoiseGenerator.valueNoise3D(x0, y1, z1, seed);
			n1   = NoiseGenerator.valueNoise3D(x1, y1, z1, seed);
			ix1  = Interpolation.interpolateLinear(n0, n1, xs);
			iy1  = Interpolation.interpolateLinear(ix0, ix1, ys);

			return Interpolation.interpolateLinear(iy0, iy1, zs);
		});
	},
	gradientCoherentNoise3D: function(x, y, z, seed, quality) 
	{
		return this.coherentNoise3D(x, y, z, seed, quality, function(x0, y0, z0, x1, y1, z1, xs, ys, zs) 
		{
			var n0, n1, ix0, ix1, iy0, iy1;

			n0  = NoiseGenerator.gradientNoise3D(x, y, z, x0, y0, z0, seed);
			n1  = NoiseGenerator.gradientNoise3D(x, y, z, x1, y0, z0, seed);
			ix0 = Interpolation.interpolateLinear(n0, n1, xs);
			n0  = NoiseGenerator.gradientNoise3D(x, y, z, x0, y1, z0, seed);
			n1  = NoiseGenerator.gradientNoise3D(x, y, z, x1, y1, z0, seed);
			ix1 = Interpolation.interpolateLinear(n0, n1, xs);
			iy0 = Interpolation.interpolateLinear(ix0, ix1, ys);
			n0  = NoiseGenerator.gradientNoise3D(x, y, z, x0, y0, z1, seed);
			n1  = NoiseGenerator.gradientNoise3D(x, y, z, x1, y0, z1, seed);
			ix0 = Interpolation.interpolateLinear(n0, n1, xs);
			n0  = NoiseGenerator.gradientNoise3D(x, y, z, x0, y1, z1, seed);
			n1  = NoiseGenerator.gradientNoise3D(x, y, z, x1, y1, z1, seed);
			ix1 = Interpolation.interpolateLinear(n0, n1, xs);
			iy1 = Interpolation.interpolateLinear(ix0, ix1, ys);

			return Interpolation.interpolateLinear(iy0, iy1, zs);
		});
	},
	makeInt32Range: function(value)
	{
		if (value >= 1073741824.0)
		{
			return (2.0 * (n % 1073741824.0)) - 1073741824.0;
		}
		else if (value <= -1073741824.0)
		{
			return (2.0 * (n % 1073741824.0)) + 1073741824.0;
		}

		return value;
	},
    clampValue: function(value, lowerBound, upperBound) 
    {
        if (value < lowerBound) return lowerBound;
        else if (value > upperBound) return upperBound;
        else return value;
	},
    exponentFilter: function(value, cover, sharpness) 
    {
		var c = value - (255 - cover);

        if(c < 0) c = 0;

		return 255 - Math.floor(Math.pow(sharpness, c) * 255);
	},
    normalizeValue: function(value, lowerBound, upperBound) 
    {
		return parseFloat(value - lowerBound) / parseFloat(upperBound - lowerBound);
	},
    swapValues: function(a, b)
    {
        if(typeof a == 'object')
        {
			b = a[1];
			a = a[0];
		}

		return [b, a];
    }
};

module.exports = NoiseGenerator