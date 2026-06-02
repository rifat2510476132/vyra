module.exports = {
  apps: [
    {
      name: 'vyra-api',
      script: 'dist/server.js',
      cwd: '../server',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '512M',
      env: {
        NODE_ENV: 'production',
        PORT: 5000,
      },
    },
  ],
};
