var Interpolation = 
{
	mapCubicSCurve: function(value)
    {
        return (Math.pow(value, 2.0) * (3.0 - 2.0 * value));
    },
    mapQuinticSCurve: function(value)
    {
        var a3 = Math.pow(value, 3.0);
        var a4 = a3 * value;
        var a5 = a4 * value;

        return (6.0 * a5) - (15.0 * a4) + (10.0 * a3);
    },
    interpolateCubic: function(a, b, c, d, position)
    {
        var p = (d - c) - (a - b);
        var q = (a - b) - p;
        var r = c - a;
        var s = b;

        return p * position * position * position + q * position * position + r * position + s;
    },
    interpolateLinear: function(a, b, position)
    {
        return ((1.0 - position) * a) + (position * b);
    }
};

module.exports = Interpolation;