require("express-async-errors");
require("dotenv/config")
const express = require("express");

const routes = require("./routes")

const AppError = require("./utils/AppError");

const uploadConfig = require("./configs/upload");
const multer = require("multer");

const app = express();

app.use(express.json());

app.use("/files", express.static(uploadConfig.UPLOADS_FOLDER));

app.use(routes);

app.use((error, request, response, next) => {
    if(error instanceof AppError) {
        return response.status(error.statusCode).json({
            status: "error",
            message: error.message
        })
    }

    if(error instanceof multer.MulterError) {
        return response.status(500).json({
            status: "Multer error",
            message: error.messsage
        })
    }

    return response.status(500).json({
        status: "error",
        message: "internal server error"
    })
})

const PORT = process.env.PORT || 3003;

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));