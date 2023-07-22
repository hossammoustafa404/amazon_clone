const app = require("./app");
const config = require("./config/config");
const connectDB = require("./config/db");

connectDB();

const port = config.server.port;
const server = app.listen(port, () => {
  console.log(`Server is listening on port ${port}:`);
});
