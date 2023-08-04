const createNDimArray = require("./utils.js");
const Complex = require("complex.js");

const findUNikolson = (l, L, n, λ, I, K) => {
  const k = (2 * Math.PI) / λ;

  const q = new Complex(0, 1 / (2 * k * n));

  const Hx = l / I;
  const Hz = L / K;

  const γ = Hz / Math.pow(Hx, 2);

  const ψ = (x) => {
    return 12 * Math.exp(-Math.pow((2 * x - l) / (0.4 * l), 4));
  };

  const u = createNDimArray([K + 1, I + 1]);

  if (u) {
    for (let k = 0; k < K + 1; ++k) {
      u[k][0] = new Complex(0, 0);
      u[k][I] = new Complex(0, 0);
    }

    for (let i = 1; i < I; ++i) {
      u[0][i] = new Complex(ψ(i * Hx), 0);
    }
    let a = new Complex(0, 0);
    a = a.add(q.mul(-γ).mul(0.5));
    let b = new Complex(0, 0);
    b = b.add(1).add(q.mul(γ));
    let c = new Complex(0, 0);
    c = c.add(q.mul(-γ).mul(0.5));

    for (let n = 0; n < K; ++n) {
      const α = new Array(K);
      const β = new Array(K);
      α[0] = new Complex(0, 0);
      β[0] = new Complex(0, 0);
      for (let j = 1; j < I; ++j) {
        const del = b.add(c.mul(α[j - 1]));
        α[j] = a.neg().div(del);
        // α[j] = -a / (b + c * α[j - 1]);
        let ξ = new Complex(0, 0);
        ξ = ξ.add(
          q
            .mul(γ)
            .mul(0.5)
            .mul(u[n][j + 1])
        );
        ξ = ξ.add(
          q
            .mul(γ)
            .mul(0.5)
            .mul(u[n][j - 1])
        );
        ξ = ξ.add(q.mul(γ).mul(-1).add(1).mul(u[n][j]));
        // β[j] = ξ.sub(c.mul(β[j - 1])).div(del);
        β[j] = ξ.sub(c.mul(β[j - 1])).div(del);
        // β[j] = (u[n][j] - c * β[j - 1]) / (b + c * α[j - 1]);
      }
      for (let j = I - 1; j > 0; --j) {
        // u[n + 1][j] = α[j] * u[n + 1][j + 1] + β[j];
        u[n + 1][j] = α[j].mul(u[n + 1][j + 1]).add(β[j]);
      }
    }
    return u;
  }
};

module.exports = findUNikolson;
