import express from "express"
import cors from "cors"
import multer from "multer"
import axios from "axios"
import fs from "fs"
import FormData from "form-data"
const app = express()

const upload = multer({dest: "public/temp"})
app.use(cors({
    origin:"*",
    credentials:true
}))

app.use(express.json({limit:"16kb"}))
app.use(express.urlencoded({extended:true , limit:"16kb"}))
app.use(express.static("public"))


app.post("/image" , upload.single("photo") , async (req , res)=>{
   try {
     // multer stores info about the uploaded file on req.file
     if (!req.file) {
         console.log("No file received. req.body:", req.body)
         return res.status(400).json({ error: "No file uploaded" })
     }
 
    const filePath = req.file.path;
    const fileName = req.file.originalname;
     console.log(11)
    // Step 2: Send to FastAPI

    const formData = new FormData();
    formData.append("file", fs.createReadStream(filePath) , fileName);


    const response = await axios.post(
      "http://127.0.0.1:5000/upload",
      formData,
      {
        headers: formData.getHeaders(),
        timeout:5000
      }
    );
     console.log(22)
     console.log("response from the flask API server" , response.data)
     console.log("uploaded file info1111:", req.file)
     // req.file.path or req.file.filename can be used to reference the saved file
     res.status(201).json({ message: "photo received and send to fastAPI servera", file: req.file.filename })
   } catch (error) {
        console.error(error)
        res.status(500).json({error:"failed to send the imgae to backend and backend to fastAPI server"})
   }
})

app.listen(8000 , ()=>{
    console.log("server is listening at port 8000")
})