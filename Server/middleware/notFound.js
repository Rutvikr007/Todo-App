const notFound = (req, res) => {
  res.status(404).send("route is not available");
};

module.exports = notFound;
