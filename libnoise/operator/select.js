var Interpolation = require('../interpolation');

var Select = function(sourceModules, controlModule, lowerBound, upperBound, fallOff) 
{
	this.sourceModules  = sourceModules || [];
	this.controlModule  = controlModule || null;
	this.fallOff           = fallOff          || Select.DEFAULT_EDGE_FALLOFF;
	this.lowerBound     = lowerBound    || Select.DEFAULT_LOWER_BOUND;
	this.upperBound     = upperBound    || Select.DEFAULT_UPPER_BOUND;
};

Select.DEFAULT_EDGE_FALLOFF = 0.0;
Select.DEFAULT_LOWER_BOUND = -1.0;
Select.DEFAULT_UPPER_BOUND = 1.0;

Select.prototype = 
{
    get fallOff() 
    {
		return this._fallOff;
	},
    set fallOff(v) 
    {
		var size = this.upperBound - this.lowerBound;
		var half = size / 2;

		this._fallOff = (v > half) ? half : v;
	},
    get lowerBound() 
    {
		return this._lowerBound;
	},
    set lowerBound(v) 
    {
		if (v > this.upperBound) throw new Error('Lower bound cannot exceed upper bound!');
		
		this._lowerBound = v;
	},
    get upperBound() 
    {
		return this._upperBound;
	},
    set upperBound(v) 
    {
        if (v < this.lowerBound) throw new Error('Upper bound cannot be less than lower bound!');

		this._upperBound = v;
	},
    setBounds: function(lower, upper) 
    {
		this.upperBound = upper;
		this.lowerBound = lower;
	},
    getValue: function(x, y, z, scale) 
    {
        if (this.sourceModules.length < 2) throw new Error('Invalid or missing source module(s)!');
        if (!this.controlModule) throw new Error('Invalid or missing control module!');

		var cv = this.controlModule.getValue(x, y, z, scale);

        if (this.fallOff > 0.0)
        {
            var a;

            if (cv < (this.lowerBound - this.fallOff))
                return this.sourceModules[0].getValue(x, y, z, scale);

            if (cv < (this.lowerBound + this.fallOff))
            {
                var lc = (this.lowerBound - this.fallOff);
                var uc = (this.lowerBound + this.fallOff);

                a = Interpolation.mapCubicSCurve((cv - lc) / (uc - lc));

                return Interpolation.interpolateLinear(this.sourceModules[0].getValue(x, y, z, scale), this.sourceModules[1].getValue(x, y, z, scale), a);
            }

            if (cv < (this.upperBound - this.fallOff))
                return this.sourceModules[1].getValue(x, y, z, scale);

            if (cv < (this.upperBound + this.fallOff))
            {
                var lc = (this.upperBound - this.fallOff);
                var uc = (this.upperBound + this.fallOff);

                a = Interpolation.mapCubicSCurve((cv - lc) / (uc - lc));

                return Interpolation.interpolateLinear(this.sourceModules[1].getValue(x, y, z, scale), this.sourceModules[0].getValue(x, y, z, scale), a);
            }

            return this.sourceModules[0].getValue(x, y, z, scale);
        }

        if (cv < this.lowerBound || cv > this.upperBound)
            return this.sourceModules[0].getValue(x, y, z, scale);

        return this.sourceModules[1].getValue(x, y, z, scale);
	}
};

module.exports = Select;