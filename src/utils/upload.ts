import multer from "multer";

export const uploadImage = multer({
  storage: multer.memoryStorage(),
});
