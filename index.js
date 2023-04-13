// // const a = [
// //   [10.8, 0.0475, 0, 0],
// //   [0.0321, 9.9, 0.0523, 0],
// //   [0, 0.0369, 9.0, 0.057],
// //   [0, 0, 0.0416, 8.1],
// // ];
// const a = [
//   [2, -1, 0],
//   [5, 4, 2],
//   [0, 1, -3],
// ];
// const b = [3, 6, 2];
// // const b = [12.143, 13.0897, 13.6744, 13.8972];

// const solve = (a, b) => {
//   const n = a.length;
//   const x = new Array(n, 0);
//   const v = new Array(n, 0);
//   const u = new Array(n, 0);
//   v[0] = a[0][1] / -a[0][0];
//   u[0] = -b[0] / -a[0][0];
//   for (let i = 1; i < n - 1; ++i) {
//     v[i] = a[i][i + 1] / (-a[i][i] - a[i][i - 1] * v[i - 1]);
//     u[i] =
//       (a[i][i - 1] * u[i - 1] - b[i]) / (-a[i][i] - a[i][i - 1] * v[i - 1]);
//   }
//   v[n - 1] = 0;
//   u[n - 1] =
//     (a[n - 1][n - 2] * u[n - 2] - b[n - 1]) /
//     (-a[n - 1][n - 1] - a[n - 1][n - 2] * v[n - 2]);

//   x[n - 1] = u[n - 1];
//   for (let i = n - 1; i > 0; --i) {
//     x[i - 1] = v[i - 1] * x[i] + u[i - 1];
//   }
//   return x;
// };

// const x = solve(a, b);
// console.log(x);

const createNDimArray = require("./utils.js");
const Complex = require("complex.js");

const l = 8;
const L = 10;
// (!)
const n = 1;
const λ = 2;
const k = (2 * Math.PI) / λ;

const N = 100;
const I = 100;
const K = 100;

const q = new Complex(0, 1 / (2 * k * n));

const Hx = l / I;
const Hz = L / K;

const γ = Hz / Math.pow(Hx, 2);

const ψ = (x) => {
  return 12 * Math.exp(-Math.pow((2 * x - l) / (0.4 * l), 4));
};

const u = createNDimArray([K + 1, I]);

for (let k = 0; k < K; ++k) {
  u[k][0] = new Complex(0, 0);
  u[k][I - 1] = new Complex(0, 0);
}

for (let i = 1; i < I - 1; ++i) {
  u[0][i] = new Complex(ψ(i * Hx), 0);
}

let a = new Complex(0, 0);
a = a.add(1).add(q.mul(2).mul(γ));
let b = new Complex(0, 0);
b = b.add(q.mul(-γ));
let c = new Complex(0, 0);
c = c.add(q.mul(-γ));

for (let n = 0; n < K; ++n) {
  const α = new Array(N);
  const β = new Array(N);
  α[0] = new Complex(0, 0);
  β[0] = new Complex(0, 0);
  for (let j = 1; j < N; ++j) {
    const del = b.add(c.mul(α[j - 1]));
    α[j] = a.neg().div(del);
    // α[j] = -a / (b + c * α[j - 1]);
    β[j] = u[n][j].sub(c.mul(β[j - 1])).div(del);
    // β[j] = (u[n][j] - c * β[j - 1]) / (b + c * α[j - 1]);
  }
  u[n + 1][I - 1] = new Complex(0, 0);
  for (let j = N - 2; j > 0; --j) {
    // u[n + 1][j] = α[j] * u[n + 1][j + 1] + β[j];
    u[n + 1][j] = α[j].mul(u[n + 1][j + 1]).add(β[j]);
  }
}
