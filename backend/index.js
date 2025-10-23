import express from "express"
import cors from "cors"
import multer from "multer"
const app = express()

const upload = multer({dest: "public/temp"})

app.use(cors({
    origin:"*",
    credentials:true
}))

app.use(express.json({limit:"16kb"}))
app.use(express.urlencoded({extended:true , limit:"16kb"}))
app.use(express.static("public"))


app.post("/image" , upload.single("photo") , (req , res)=>{
    // multer stores info about the uploaded file on req.file
    if (!req.file) {
        console.log("No file received. req.body:", req.body)
        return res.status(400).json({ error: "No file uploaded" })
    }

    console.log("uploaded file info:", req.file)
    // req.file.path or req.file.filename can be used to reference the saved file
    res.status(201).json({ message: "photo received", file: req.file.filename })
})

app.listen(8000 , ()=>{
    console.log("server is listening at port 8000")
})