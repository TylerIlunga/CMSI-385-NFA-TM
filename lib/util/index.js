const fs = require('fs');
module.exports = {
  persistResult(word, isAccepted, filePath = process.env.RESULTS_PATH) {
    const result = `${word}: ${isAccepted}\n\n`;
    fs.open(filePath, 'w', async (err, fd) => {
      if (err) {
        return fs.writeFile(filePath, result, err => {
          fs.close(fd, () => {
            console.log(err ? err : 'Results written to: ', filePath);
          });
        });
      }
      fs.appendFile(filePath, result, 'utf8', () => {
        fs.close(fd, () => {
          console.log('Results written to: ', filePath);
        });
      });
    });
  },
};
