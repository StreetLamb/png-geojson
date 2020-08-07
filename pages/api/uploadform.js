import convertImagetoGeojson from "../../utils/convertimage";
const multer = require("multer");

export const config = {
  api: {
    bodyParser: false,
  },
};

const upload = multer({
  //   dest: "images",
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
      const { lLat, lLong, uLat, uLong } = req.query;
      upload(req, res, (err) => {
        if (req.fileValidationError || err || !req.file) {
          return res.status(400).end();
        }
        const imageBuffer = req.file.buffer;
        convertImagetoGeojson(
          parseFloat(lLat),
          parseFloat(lLong),
          parseFloat(uLat),
          parseFloat(uLong),
          imageBuffer,
          (polygonList) => {
            if (polygonList === "error") {
              res.status(400).send("Bad request");
            }
            res.send(polygonList);
          }
        );
      });
    } catch {
      res.status(400).send("Bad request");
    }
  }
};
