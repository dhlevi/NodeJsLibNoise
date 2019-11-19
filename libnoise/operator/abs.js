var Abs = function(sourceModule) 
{
    this.sourceModule = sourceModule || null;
};

Abs.prototype.getValue = function(x, y, z, scale) 
{
    if(!this.sourceModule) throw new Error('Invalid or missing source module!');
    
    return Math.abs(this.sourceModule.getValue(x, y, z, scale));
};

module.exports = Abs;