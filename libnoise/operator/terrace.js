var utils = require('../utils.js');
var Interpolation = require('../interpolation.js');
    
var Terrace = function(sourceModule, controlPoints, invert) 
{
	this.sourceModule  = sourceModule  || null;
	this.controlPoints = controlPoints || [];
	this.invert        = invert        || false;
};

Terrace.prototype.getValue = function(x, y, z, scale)
{
	var smv = this.sourceModule.getValue(x, y, z, scale);

	var ip = 0;

	for(var i = 0; i < this.controlPoints.length; i++)
	{
		var cp = this.controlPoints[i];
		if (smv < cp)
			break;

		ip++;
	}

	var i0 = utils.clampValue(ip - 1, 0, this.controlPoints.length - 1);
	var i1 = utils.clampValue(ip, 0, this.controlPoints.length - 1);

	if (i0 == i1)
		return this.controlPoints[i1];

	var v0 = this.controlPoints[i0];
	var v1 = this.controlPoints[i1];
	var a = (smv - v0) / (v1 - v0);

	if (this.invert)
	{
		a = 1.0 - a;

		var t = v0;

		v0 = v1;
		v1 = t;
	}

	a *= a;

	return Interpolation.interpolateLinear(v0, v1, a);
};

Terrace.prototype.Generate = function(steps)
{
	if (steps < 2)
		throw new Error("A minimum of two Control Points are required to process the Terrace operation.");

	this.controlPoints = [];

	var ts = 2.0 / (steps - 1.0);
	var cv = -1.0;

	for (var i = 0; i < steps; i++)
	{
		this.controlPoints[i] = cv;
		cv += ts;
	}
};

Terrace.prototype.findInsertionPos = function(value) 
{
	value = parseFloat(value);

    for (var insertionPos = 0; insertionPos < this.controlPoints.length; insertionPos++)
    {
		if (value < this.controlPoints[insertionPos]) break;
		// Each control point is required to contain a unique value, so throw an exception. 
        else if (value == this.controlPoints[insertionPos]) throw new Error('Invalid parameter');
	}

	return insertionPos;
};

Terrace.prototype.insertAtPos = function (insertionPos, value) 
{
	insertionPos = parseInt(insertionPos);
	value = parseFloat(value);

	var newControlPoints = [];

    for (var i = 0; i < this.controlPoints.length; i++) 
    {
        if (i < insertionPos) newControlPoints[i] = this.controlPoints[i];
        else newControlPoints[i + 1] = this.controlPoints[i];
	}

	this.controlPoints = newControlPoints;

	this.controlPoints[insertionPos] = value;
};

Terrace.prototype.addControlPoint = function(value) 
{
	value = parseFloat(value);

	this.insertAtPos(this.findInsertionPos(value), value);
};

module.exports = Terrace;