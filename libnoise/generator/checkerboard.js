const utils  = require('../utils.js');

var Checkerboard = function() {};

Checkerboard.prototype.getValue = function(x, y, z) 
{
	var ix = Math.floor(utils.makeInt32Range(x));
	var iy = Math.floor(utils.makeInt32Range(y));
	var iz = Math.floor(utils.makeInt32Range(z));

	return (ix & 1 ^ iy & 1 ^ iz & 1) ? -1.0 : 1.0;
};

module.exports  = Checkerboard;