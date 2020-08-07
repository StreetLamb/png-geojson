const multer = require("multer");

export const config = {
  api: {
    bodyParser: false,
  },
};

const upload = multer({
  dest: "images",
  limits: {
    fileSize: 2000000,
  },
  fileFilter(req, file, cb) {
    if (file.mimetype !== "image/png") {
      req.fileValidationError = "Wrong file format!";
      return cb(null, false, new Error("goes wrong on the mimetype"));
    }
    return cb(undefined, true);
  },
}).single("upload");

export default (req, res) => {
  if (req.method === "POST") {
    try {
      upload(req, res, (err) => {
        if (req.fileValidationError) {
          return res.status(400).send({ status: err });
        }
        return res.json({ status: "success", filename: req.file.filename });
      });
    } catch {
      return res.status(500).json({ status: "Something went wrong" });
    }
  }
};
