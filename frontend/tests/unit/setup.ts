import process from 'process';

process.on('unhandledRejection', (reason, promise) => {
  console.error('unhandledRejection', reason);
});
