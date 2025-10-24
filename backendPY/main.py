from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.responses import JSONResponse

app = FastAPI()

@app.post("/upload/")
async def upload_file(file: UploadFile = File(None)):  # Allow None initially
    # Check if file was provided
    if file is None:
        raise HTTPException(status_code=400, detail="No file was provided")

    # Read the file content
    content = await file.read()

    # If empty file
    if len(content) == 0:
        raise HTTPException(status_code=400, detail="Uploaded file is empty")

    # Save the file locally (optional)
    with open(f"received_{file.filename}", "wb") as f:
        f.write(content)

    return JSONResponse({
        "filename": file.filename,
        "type": file.content_type,
        "size": len(content)
    })
