module.exports = {
  presets: [
    ['@babel/preset-env', { targets: { node: 'current' } }],
    '@babel/preset-typescript'
  ],
  plugins: [
    [
      'module-resolver',
      {
        alias: {
          '@src': './src',
          '@shared': './src/shared',
          '@errors': './src/shared/errors',
          '@modules': './src/modules',
          '@utils': './src/utils',
          '@configs': './src/configs',
          '@providers': './src/shared/providers',
        }
      }
    ],
    'babel-plugin-transform-typescript-metadata',
    ['@babel/plugin-proposal-decorators', { legacy: true }],
    ['@babel/plugin-proposal-class-properties', { loose: true }],
  ]
}
