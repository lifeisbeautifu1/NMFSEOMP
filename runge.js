const findU = require("./solve");
const {
  calculateIteration,
  calculateModuleOfComplexNumber,
} = require("./analitical");

const start = () => {
  const { l, L, n, λ, I, K } = { l: 8, L: 10, n: 1, λ: 2, I: 10, K: 10 };

  let u = findU(l, L, n, λ, I, K);
  u = u.map((u) => u.map((v) => v.abs()));

  let b = findU(l, L, n, λ, I, K * 2);
  b = b.map((d) => d.map((v) => v.abs()));

  u = u.map((u, index) => u.map((v, idx) => -v + 2 * b[index * 2][idx]));

  let Sum = 0;
  for (let z = 0; z <= L; z++) {
    for (let x = 0; x <= l; x++) {
      let R = 0;
      let IM = 0;
      for (let t = 1; t <= 100; ++t) {
        const [tmpR, tmpIM] = calculateIteration({
          l,
          n,
          z: (Math.round(z / (L / K)) * L) / K,
          λ,
          t,
          x: (Math.round(x / (l / I)) * l) / I,
        });
        R += tmpR;
        IM += tmpIM;
      }
      const analiticalU = calculateModuleOfComplexNumber([R, IM]);
      const iterationalU = u[Math.round(z / (L / K))][Math.round(x / (l / I))];

      Sum += (analiticalU - iterationalU) ** 2;
    }
  }
  Sum = Math.sqrt(Sum);
  console.log("Sum: ", Sum);
};
start();
