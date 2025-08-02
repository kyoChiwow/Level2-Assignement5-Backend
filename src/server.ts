/* eslint-disable no-console */
import { Server } from "http";
import mongoose from "mongoose";
import app from "./app";
import { envVars } from "./config/env";

let server: Server;

const startServer = async () => {
  try {
    await mongoose.connect(envVars.DB_URL);
    console.log("Connected to Parcel Database!");
    server = app.listen(envVars.PORT, () => {
      console.log(`Server running on port ${envVars.PORT}`);
    });
  } catch (error) {
    console.log(error);
  }
};

(async () => {
  await startServer();
})();

process.on("unhandledRejection", (error) => {
    console.log("Unhandled Rejection, Server shutting down!", error);

    if(server) {
        server.close(() => {
            console.log("Server Closed Now!")
            process.exit(1);
        })
    }

    process.exit(1);
})

process.on("uncaughtException", (error) => {
    console.log("Uncaught Exception, Server shutting down!", error);

    if(server) {
        server.close(() => {
            console.log("Server Closed Now!")
            process.exit(1);
        })
    }

    process.exit(1);
})

process.on("SIGTERM", () => {
    console.log("SIGTERM RECEIVED, Server shutting down!");

    if (server) {
        server.close(() => {
            console.log("Server Closed Now!")
            process.exit(1);
        })
    }

    process.exit(1);
})

process.on("SIGINT", () => {
    console.log("SIGINT RECEIVED, Server shutting down!");

    if (server) {
        server.close(() => {
            console.log("Server Closed Now!")
            process.exit(1);
        })
    }

    process.exit(1);
})