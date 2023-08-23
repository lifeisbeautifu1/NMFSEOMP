const path = require("path");
const fs = require("fs");
const {
  calculateIteration,
  calculateModuleOfComplexNumber,
} = require("./analitical");

(function getPoints() {
  const res = [];
  l = 8;
  L = 10;
  n = 1;
  λ = 2;
  for (let x = 0; x <= l; x++) {
    for (let z = 0; z <= L; z++) {
      let R = 0;
      let IM = 0;
      for (let t = 1; t <= 100; ++t) {
        const [tmpR, tmpIM] = calculateIteration({
          l,
          n,
          z,
          λ,
          t,
          x,
        });
        R += tmpR;
        IM += tmpIM;
      }
      const analiticalU = calculateModuleOfComplexNumber([R, IM]);
      res.push({
        x,
        z,
        u: analiticalU,
      });
    }
  }
  fs.writeFileSync("pointz.json", JSON.stringify(res, null, 4));
})();
