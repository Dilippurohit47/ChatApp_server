import mongoose from "mongoose";

const connectDb = (uri) => {
  mongoose
    .connect(uri, {
      dbName: "ChatApp",
    })
    .then((data) => {
        console.log(`Server is connected to DB :${data.connection.host}`)
    })
    .catch((err) => {
      throw err;
    });
};

export {connectDb}