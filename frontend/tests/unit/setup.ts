import process from 'process';

process.on('unhandledRejection', (reason) => {
  console.error('unhandledRejection', reason);
});
