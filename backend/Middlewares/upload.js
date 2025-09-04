const multer =require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    let folder = 'Uploads'

      if (file.fieldname.includes('qrisImage')) {
      folder = 'uploads/qris';
    } else if (file.fieldname.includes('img_url')) {
      folder = 'uploads/products';
    } else if (file.fieldname.includes('profile')) {
      folder = 'uploads/profiles';
    }

    cb(null, folder) //pastikan folder upload ada
  },
  filename: function (req, file, cb) {
   const ext = path.extname(file.originalname);
   const filename = `${file.fieldname}-${Date.now()}${ext}`
   cb(null,filename)
  }
})

const fileFilter = (req, file, cb) =>{
    const allowdTypes = ["image/jpeg", "image/png", "image/jpg"];
    if(allowdTypes.includes(file.mimetype)) cb(null,true);
    else cb(new Error("Hanya file JPG/PNG/JPEG yang diperbolehkan"));
}

const upload = multer({ storage: storage, fileFilter })
module.exports = upload