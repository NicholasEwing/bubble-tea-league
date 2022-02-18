const http = require("http");
const products = require("./data/products.json");

const server = http.createServer((req, res) => {
  console.log("something hit this endpoint!");
  console.log(req.body);
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
