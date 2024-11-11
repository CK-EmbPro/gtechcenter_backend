import multer from "multer"
import fs from "fs"
const storage = multer.diskStorage({
    
    destination: (req, file, cb)=> {
        const uploadDir = 'uploads/'
        if(!fs.existsSync(uploadDir)){
            fs.mkdirSync(uploadDir)
        }
        cb(null, uploadDir)
    }, 

    filename: (req, file, cb)=>{
        cb(null, `${file.originalname}`)
    }
})

export const upload = multer({storage})