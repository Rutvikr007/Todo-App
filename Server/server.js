const app = require("./app");
const connectDB = require("./db/connect");

const start = async () => {
  try {
    // connect to mongoDB
    await connectDB(process.env.MONGO_URI);

    //  start app
    app.listen(port, () => {
      console.log(`server is listening at ${port}`);
    });
  } catch (error) {
    console.log("DB connection failed");
    console.log(error);
    process.exit(1);
  }
};

start();
