var utils = require('../utils.js');
var Interpolation = require('../interpolation.js');
    
var Curve = function(sourceModule, controlPoints) 
{
	this.sourceModule  = sourceModule  || null;
	this.controlPoints = controlPoints || [];
};

Curve.prototype.findInsertionPos = function(value) 
{
	value = parseFloat(value);

    for (var position = 0; position < this.controlPoints.length; position++) 
    {
		// We found the array index in which to insert the new control point.
        if (value < this.controlPoints[position]) break;
		// Each control point is required to contain a unique value
        else if (value == this.controlPoints[position]) throw new Error('Invalid parameter');
	}

	return position;
};

Curve.prototype.insertAtPos = function (position, input, output) 
{
	position = parseInt(position);
	input = parseFloat(input);
	output = parseFloat(output);

	var newControlPoints = [];

    for (var i = 0; i < this.controlPoints.length; i++) 
    {
        if (i < position) newControlPoints[i] = this.controlPoints[i];
        else newControlPoints[i + 1] = this.controlPoints[i];
	}

	this.controlPoints = newControlPoints;
	this.controlPoints[position] = [input, output];
};

Curve.prototype.addControlPoint = function(input, output) 
{
	input = parseFloat(input);
	output = parseFloat(output);

	this.insertAtPos(this.findInsertionPos(input), input, output);
};

Curve.prototype.getValue = function(x, y, z, scale) 
{
    if (!this.sourceModule) throw new Error('Invalid or missing source module!');

    if (!this.controlPoints.length >= 4) throw new Error('Insufficient number of control points!');

	var value = this.sourceModule.getValue(x, y, z, scale);

	// Find the first element in the control point array that has an input value larger than the output value from the source module.
    for (var indexPos = 0; indexPos < this.controlPoints.length; indexPos++) 
    {
        if (value < this.controlPoints[indexPos][0]) break;
	}

	// Find the four nearest control points so that we can perform cubic interpolation.
	var index0 = utils.clampValue(indexPos - 2, 0, this.controlPoints.length - 1);
	var index1 = utils.clampValue(indexPos - 1, 0, this.controlPoints.length - 1);
	var index2 = utils.clampValue(indexPos, 0, this.controlPoints.length - 1);
	var index3 = utils.clampValue(indexPos + 1, 0, this.controlPoints.length - 1);

	// If some control points are missing (which occurs if the value from the
	// source module is greater than the largest input value or less than the
	// smallest input value of the control point array), get the corresponding
	// output value of the nearest control point and exit now.
    if (index1 == index2) return this.controlPoints[index1][1];

	// Compute the alpha value used for cubic interpolation.
	var input0 = this.controlPoints[index1][0];
	var input1 = this.controlPoints[index2][0];
	var alpha = (value - input0) / (input1 - input0);

	return Interpolation.interpolateCubic(
		this.controlPoints[index0][1],
		this.controlPoints[index1][1],
		this.controlPoints[index2][1],
		this.controlPoints[index3][1],
		alpha
	);
};

module.exports = Curve;