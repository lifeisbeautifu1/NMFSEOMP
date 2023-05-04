const createNDimArray = require("./utils.js");
const Complex = require("complex.js");
const express = require("express");
const cors = require("cors");
const app = express();

const findU = (l, L, n, λ, I, K) => {
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
    a = a.add(q.mul(-γ));
    let b = new Complex(0, 0);
    b = b.add(1).add(q.mul(2).mul(γ));
    let c = new Complex(0, 0);
    c = c.add(q.mul(-γ));

    for (let n = 0; n < K; ++n) {
      const α = new Array(K);
      const β = new Array(K);
      α[0] = new Complex(0, 0);
      β[0] = new Complex(0, 0);
      for (let j = 1; j < I; ++j) {
        const del = b.add(c.mul(α[j - 1]));
        α[j] = a.neg().div(del);
        // α[j] = -a / (b + c * α[j - 1]);
        β[j] = u[n][j].sub(c.mul(β[j - 1])).div(del);
        // β[j] = (u[n][j] - c * β[j - 1]) / (b + c * α[j - 1]);
      }
      u[n + 1][I - 1] = new Complex(0, 0);
      for (let j = I - 2; j > 0; --j) {
        // u[n + 1][j] = α[j] * u[n + 1][j + 1] + β[j];
        u[n + 1][j] = α[j].mul(u[n + 1][j + 1]).add(β[j]);
      }
    }

    return u;
  }
};

app.use(express.json());
app.use(cors());

app.post("/", (req, res) => {
  const { l, L, n, λ, I, K } = req.body;
  const u = findU(l, L, n, λ, I, K);

  res.status(200).send(u.map((u) => u.map((v) => v.abs())));
});

app.listen(5000, () => console.log("Server running"));
