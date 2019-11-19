const utils  = require('./utils.js');
const Interpolation  = require('./interpolation.js');

var NoiseFactory = function() {};

NoiseFactory.UC_BORDER = 1;

NoiseFactory.WORLD_SOUTH = -90.0;
NoiseFactory.WORLD_NORTH = 90.0;
NoiseFactory.WORLD_WEST = -180.0;
NoiseFactory.WORLD_EAST = 180.0;

NoiseFactory.prototype.sphericalPoint = function(generator, lat, lon, scale)
{
    var r = Math.cos(utils.DEG_TO_RAD * lat);

    return generator.getValue(r * Math.cos(utils.DEG_TO_RAD * lon), Math.sin(utils.DEG_TO_RAD * lat), r * Math.sin(utils.DEG_TO_RAD * lon), scale);
}

NoiseFactory.prototype.spherical = function(generator, width, height, south, north, west, east, isNormalized, scale)
{
    var ucWidth = width + NoiseFactory.UC_BORDER * 2;
    var ucHeight = height + NoiseFactory.UC_BORDER * 2;

    // init the array
    var data = new Array(ucWidth); //from new double[ucWidth][ucHeight];
    for (var i = 0; i < data.length; i++)
    {
        data[i] = new Array(ucHeight);
    }

    if (east <= west || north <= south)
        throw new Error("Invalid east/west or north/south combination");
    if (!generator)
        throw new Error("Generator is null");

    var loe = east - west;
    var lae = north - south;
    var xd = loe / (width - NoiseFactory.UC_BORDER);
    var yd = lae / (height - NoiseFactory.UC_BORDER);
    var clo = west;

    for (var x = 0; x < ucWidth; x++)
    {
        var cla = south;
        for (var y = 0; y < ucHeight; y++)
        {
            // process x, y, cla, clo
            var sample = this.sphericalPoint(generator, cla, clo, scale);
            if (isNormalized)
                sample = (sample + 1) / 2;

            data[x][y] = sample;
            cla += yd;
        }
        clo += xd;
    }

    return data;
}

NoiseFactory.prototype.cylindricalPoint = function(generator, angle, height, scale)
{
    var x = Math.cos(angle * utils.DEG_TO_RAD);
    var y = height;
    var z = Math.sin(angle * utils.DEG_TO_RAD);

    return generator.getValue(x, y, z, scale);
}

NoiseFactory.prototype.cylindrical = function(generator, width, height, angleMin, angleMax, heightMin, heightMax, isNormalized, scale)
{
    var ucWidth = width + NoiseFactory.UC_BORDER * 2;
    var ucHeight = height + NoiseFactory.UC_BORDER * 2;
    
    // init the array
    var data = new Array(ucWidth); //from new double[ucWidth][ucHeight];
    for (var i = 0; i < data.length; i++)
    {
        data[i] = new Array(ucHeight);
    }

    if (angleMax <= angleMin || heightMax <= heightMin)
        throw new Error("Invalid angle or height parameters");
    if (!generator)
        throw new Error("Generator is null");

    var ae = angleMax - angleMin;
    var he = heightMax - heightMin;
    var xd = ae / (width - NoiseFactory.UC_BORDER);
    var yd = he / (height - NoiseFactory.UC_BORDER);
    var ca = angleMin;

    for (var x = 0; x < ucWidth; x++)
    {
        var ch = heightMin;
        for (var y = 0; y < ucHeight; y++)
        {
            var sample = this.cylindricalPoint(generator, ca, ch, scale);
            if (isNormalized)
                sample = (sample + 1) / 2;

            data[x][y] = sample;

            ch += yd;
        }
        ca += xd;
    }

    return data;
}

NoiseFactory.prototype.planarPoint = function(generator, x, y, scale)
{
    return generator.getValue(x, 0.0, y, scale);
}

NoiseFactory.prototype.planar = function(generator, width, height, left, right, top, bottom, isSeamless, isNormalized, scale)
{
    var ucWidth = width + NoiseFactory.UC_BORDER * 2;
    var ucHeight = height + NoiseFactory.UC_BORDER * 2;
    
    // init the array
    var data = new Array(ucWidth); //from new double[ucWidth][ucHeight];
    for (var i = 0; i < data.length; i++)
    {
        data[i] = new Array(ucHeight);
    }

    if (right <= left || bottom <= top)
        throw new Error("Invalid right/left or bottom/top combination");
    if (generator == null)
        throw new Error("Base Module is null");

    var xe = right - left;
    var ze = bottom - top;
    var xd = xe / (width - NoiseFactory.UC_BORDER);
    var zd = ze / (height - NoiseFactory.UC_BORDER);
    var xc = left;

    for (var x = 0; x < ucWidth; x++)
    {
        var zc = top;
        for (var y = 0; y < ucHeight; y++)
        {
            var fv;

            if (isSeamless) fv = this.planarPoint(generator, xc, zc, scale);
            else
            {
                var swv = this.planarPoint(generator, xc, zc, scale);
                var sev = this.planarPoint(generator, xc + xe, zc, scale);
                var nwv = this.planarPoint(generator, xc, zc + ze, scale);
                var nev = this.planarPoint(generator, xc + xe, zc + ze, scale);

                var xb = 1.0 - ((xc - left) / xe);
                var zb = 1.0 - ((zc - top) / ze);

                var z0 = Interpolation.interpolateLinear(swv, sev, xb);
                var z1 = Interpolation.interpolateLinear(nwv, nev, xb);

                fv = Interpolation.interpolateLinear(z0, z1, zb);
            }

            if (isNormalized)
                fv = (fv + 1) / 2;

            data[x][y] = fv;
            zc += zd;
        }
        xc += xd;
    }

    return data;
}

module.exports = NoiseFactory;