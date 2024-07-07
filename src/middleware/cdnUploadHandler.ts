import multer from "multer";

const storage = multer.memoryStorage();

const cdnUpload = multer({ storage });

export default cdnUpload;
