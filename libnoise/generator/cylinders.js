var Cylinders = function(frequency) 
{
	this.frequency = frequency || Cylinders.DEFAULT_FREQUENCY;
};

Cylinders.DEFAULT_FREQUENCY = 1.0;

Cylinders.prototype.getValue = function(x, y, z) 
{
	x = parseFloat(x * this.frequency);
	y = parseFloat(y * this.frequency);
	z = parseFloat(z);

	var distFromCenter = Math.sqrt(x * x + z * z);
    var distFromSmallerSphere = distFromCenter - Math.floor(distFromCenter);
    var distFromLargerSphere = 1.0 - distFromSmallerSphere;
    var nearestDist = Math.min(distFromSmallerSphere, distFromLargerSphere);

	return 1.0 - (nearestDist * 4.0);
};

module.exports = Cylinders;