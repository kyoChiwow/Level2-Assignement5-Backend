import express, { Request, Response } from "express";
import cors from "cors";
import { router } from "./routes";
import { globalErrorHandler } from "./middlewares/globalErrorHandler";
import notFound from "./middlewares/notFound";

const app = express();

app.use(express.json());
app.use(cors());

app.use("/api", router);

app.get("/", (req: Request, res: Response) => {
    res.status(200).json({
        message: "Welcome to Parcel Management Backend!"
    })
})

app.use(globalErrorHandler);
app.use(notFound);

export default app;