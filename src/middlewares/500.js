'use strict';

// export Error handler for server and network issues
module.exports = (err, req, res, next) => {
  res.status(500).json({ error: err.message });
};
