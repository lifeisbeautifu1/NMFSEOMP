const calculateInnerFunction = (l, n, x) => {
  return (
    (24 / l) *
    Math.exp(-Math.pow((2 * x - l) / (0.4 * l), 4)) *
    Math.sin((Math.PI * n * x) / l)
  );
};

const calculateIteration = ({ l, n, z, λ, t, x }) => {
  const An = calculateAn(l, t);
  const rightSide = calculateRightSide(l, t, x);
  const [R, IM] = calucateComplexNumber(l, n, z, λ, t);
  return [R * An * rightSide, IM * An * rightSide];
};

const calculateRightSide = (l, n, x) => {
  return Math.sin((Math.PI * n * x) / l);
};

const calculateModuleOfComplexNumber = (numbers) => {
  const [x, y] = numbers;
  return Math.sqrt(x * x + y * y);
};

const calucateComplexNumber = (l, n, z, λ, t) => {
  let value = (λ * Math.PI * t * t * z) / (4 * l * l * n);
  return [Math.cos(value), Math.sin(value)];
};

const calculateAn = (l, n) => {
  const t = 1000;
  const h = l / t;
  const xi = [];
  const fxi = [];
  for (let i = 0; i < t + 1; ++i) {
    if (i == 0) {
      xi.push(0);
      fxi.push(calculateInnerFunction(l, n, 0));
    } else {
      xi.push(xi[i - 1] + h);
      fxi.push(calculateInnerFunction(l, n, xi[i - 1] + h));
    }
  }
  let oddSum = 0;
  let evenSum = 0;
  for (let i = 1; i < t; ++i) {
    if (i % 2 == 0) {
      evenSum += fxi[i];
    } else {
      oddSum += fxi[i];
    }
  }
  return (h / 3) * (fxi[0] + fxi[t] + 2 * evenSum + 4 * oddSum);
};

module.exports = {
  calculateIteration,
  calculateModuleOfComplexNumber,
};
