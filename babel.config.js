module.exports = {
  presets: ['@vue/cli-plugin-babel/preset'],
  plugins: [
    ['@babel/proposal-decorators', { legacy: true }],
    ['@babel/proposal-class-properties', { loose: true }],
    ['@babel/plugin-proposal-optional-chaining'],
    ['@babel/plugin-proposal-nullish-coalescing-operator'],
  ],
};
