import mongoose from "mongoose";

export const dbConnection = () => {
    mongoose.connect(process.env.DBURL).then(() => {

        console.log("db connection successful 👌");

    }).catch((err) => {

        console.log("db not connected 💥", err);
    })
}