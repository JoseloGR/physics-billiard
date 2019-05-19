// Global variables:
var k = 9 * (powerOf(10, 9));

function calculateDistanceBetweenTwoPoints(pos1, pos2){
    x1 = pos1.x;
    x2 = pos2.x;
    y1 = pos1.y;
    y2 = pos2.y;
    z1 = pos1.z;
    z2 = pos2.z;
    return (Math.sqrt(((x2 - x1) * (x2 - x1)) + ((y2 - y1) * (y2 - y1)) + ((z2 - z1) * (z2 - z1))));
}

function powerOf(n, x){
    if (x == 0)
        return 1;
    else if (x == 1)
        return n;
    else if (n == 0)
        return 0;
    else {
        var res = n;
        for (var i = 1; i < x; i++)
            res *= n;
        return res;
    }
}

function calculateR(p1, p2, d12){
    return ((p1 - p2) / d12);
}

function calculateForceWithinAnAxis(q1, q2, d){
    return ((k * Math.abs(q1) * Math.abs(q2)) / powerOf(d, 2));
}