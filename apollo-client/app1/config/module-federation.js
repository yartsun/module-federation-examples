const deps = require('../package.json').dependencies;

const sharedDependencies = {
  react: { requiredVersion: deps.react, eager: true },
  'react-dom': deps['react-dom'],
  graphql: { requiredVersion: deps.graphql, eager: true },
  '@apollo/client': {
    eager: true,
    singleton: true,
    requiredVersion: deps['@apollo/client'],
  },
  'node-fetch': deps['node-fetch'],
  'serialize-javascript': deps['serialize-javascript'],
};

module.exports = (FederationPlugin) => ({
  client: new FederationPlugin({
    remoteType: 'script',
    name: 'app1',
    filename: 'remoteEntry.js',
    remotes: {
      app2: 'app2@http://localhost:3001/static/remoteEntry.js',
    },
    shared: sharedDependencies,
  }),
  server: [
    new FederationPlugin({
      remoteType: 'script',
      name: 'app1',
      library: { type: 'commonjs-module', name: 'app1' },
      filename: 'remoteEntry.js',
      remotes: {
        app2: 'app2@http://localhost:3001/server/remoteEntry.js',
      },
      runtimePlugins: [require.resolve('@module-federation/node/runtimePlugin')],
      shared: sharedDependencies,
    }),
  ],
});
