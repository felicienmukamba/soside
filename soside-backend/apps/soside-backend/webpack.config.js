// Le bundle de la gateway exporte la fonction serverless (module.exports.default) pour Vercel (api/index.js).
module.exports = (options) => ({
  ...options,
  output: { ...options.output, libraryTarget: 'commonjs2' },
});
