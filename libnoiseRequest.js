var LibnoiseRequest = function(id, queryVals, request) 
{
    this.id = id || "1";
    this.status = "Submitted";
    this.request = request;
    this.results = [];
    this.link = "/GenerateNoiseMapResults/" + id;
    this.width = parseInt(queryVals.width)   || 100;
    this.height = parseInt(queryVals.height) || 100;
    this.scale = parseInt(queryVals.scale)   || 1;
    this.isNormalized = queryVals.normalized || true;
    this.isSeamless = queryVals.seamless     || true;
    this.minY = parseInt(queryVals.minY)     || -90;
    this.maxY = parseInt(queryVals.maxY)     || 90;
    this.minX = parseInt(queryVals.minX)     || -180;
    this.maxX = parseInt(queryVals.maxX)     || 180;
    this.left = parseInt(queryVals.left)     || 0;
    this.right = parseInt(queryVals.right)   || 1;
    this.top = parseInt(queryVals.top)       || 0;
    this.bottom = parseInt(queryVals.bottom) || 1;
    this.type = queryVals.type               || 'planar';
    this.returnImage = queryVals.asImage     || false;
    this.date = new Date();
};

module.exports = LibnoiseRequest;