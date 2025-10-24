from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.responses import JSONResponse
from PIL import Image
import io

app = FastAPI()

@app.post("/upload")
async def upload_file(file: UploadFile = File(None)):
    if file is None:
        raise HTTPException(status_code=400, detail="No file was provided")

    content = await file.read()

    if len(content) == 0:
        raise HTTPException(status_code=400, detail="Uploaded file is empty")
    print(11)
    # ✅ Convert to Pillow image
    try:
        image = Image.open(io.BytesIO(content)).convert("RGB")
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Invalid image file: {e}")

    print(f"✅ Image converted to Pillow format: {image.size}, {image.mode}")

    # (Optional) Save the image locally
    image.save(f"received_{file.filename or 'uploaded'}.png")


    return JSONResponse({
        "filename": file.filename,
        "type": file.content_type,
        "size": len(content),
        "width": image.width,
        "height": image.height,
        "mode": image.mode
    })
