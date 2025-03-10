import mongoose from "mongoose";

export const Connection = async (username, password) => {
  const URL = `mongodb+srv://${username}:<${password}>@sayhello-gmc.nthve.mongodb.net/?retryWrites=true&w=majority&appName=SayHello-GMC`;
  try {
    await mongoose.connect(
      URL

      //   {useUnifiedTopology: true,
      //   useNewUrlParser: true,
      // }
    );
    console.log("Database connected succesfully");
  } catch (error) {
    console.log("Error while connecting the database", error.message);
  }
};

export default Connection;
