function kFormatter(num) {
  return Math.abs(num) > 999
    ? Math.sign(num) * (Math.abs(num) / 1000).toFixed(1) + " K"
    : Math.sign(num) * Math.abs(num);
}

function percentageFormatter(number) {
  return Math.floor((Math.round(number * 100) / 100) * 100);
}

function varAsString(varObj) {
  Object.keys(varObj)[0];
}

export { kFormatter, percentageFormatter, varAsString };
