import { useState ,useRef , useEffect} from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [photo , setphoto] = useState(null)
  const [previewUrl, setPreviewUrl] = useState(null)
  const [cameraActive , setcameraActive] = useState(false)
  const videoref = useRef(null)

// using camera

  const accesscamera = async ()=>{
    const stream = await navigator.mediaDevices.getUserMedia({video:true});
    videoref.current.srcObject = stream;
    console.log(videoref.current.srcObject)
    setcameraActive(true)
    videoref.current.play();
  }

  const takepic = ()=>{
    const canvas = document.createElement("canvas");
    canvas.width = videoref.current.videoWidth;
    canvas.height = videoref.current.videoHeight;
    canvas.getContext("2d").drawImage(videoref.current, 0, 0);
    // Convert canvas to Blob/File and store both file and preview URL
    canvas.toBlob((blob) => {
      if (!blob) return;
      const file = new File([blob], "camera-photo.png", { type: "image/png" });
      // revoke previous preview if any
      if (previewUrl) URL.revokeObjectURL(previewUrl);
      const url = URL.createObjectURL(file);
      setphoto(file);
      setPreviewUrl(url);
    }, "image/png");
  }

  // using memory
  const handlefilechange = (e)=>{
    console.log(e.target.files[0])
    const file = e.target.files[0]
    if (!file) return
    if (previewUrl) URL.revokeObjectURL(previewUrl)
    const url = URL.createObjectURL(file)
    setphoto(file)
    setPreviewUrl(url)
  }
  useEffect(() => {
    if (!photo) return; // don't run fetch if photo is null

    const send = async () => {
      try {
        const formData = new FormData();
        formData.append('photo', photo);

        const res = await fetch('http://localhost:8000/image', { method: 'POST', body: formData })
        const data = await res.json()
        console.log('Upload response:', data)
      } catch (err) {
        console.error('Error sending photo:', err)
      }
    }

    send()

    // cleanup: revoke previewUrl when component unmounts or photo changes
    return () => {
      // Do not revoke here because we might still be using previewUrl elsewhere
    }
  }, [photo]); // dependency array
  


  return (
    <>
    
    {cameraActive? <h2>capture from camera</h2> : null}
    <video ref={videoref}></video>
    <br />
    <button onClick={accesscamera}>USE CAMERA</button>
    {cameraActive ? <button onClick={takepic}>CAPTURE</button> : null}

    {previewUrl && (
      <div>
        <h3>captured image</h3>
        <img src={previewUrl}  />
      </div>
    )}
 
  <input type="file" accept='image/*' id="fileInput" onChange={handlefilechange} style={{display:"none"}}/>

    <label
        htmlFor="fileInput"
        style={{
          backgroundColor: "#181819ff",
          color: "white",
          padding: "10px 20px",
          borderRadius: "8px",
          cursor: "pointer",
          fontWeight: "bold",
        }}
      >choose file</label>

    {previewUrl && (
        <div>
          <h3>Preview:</h3>
          <img src={previewUrl} alt="preview" style={{ maxWidth: "300px"  }} />
        </div>
      )}
    </>
  )
}

export default App
