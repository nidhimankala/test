import React,{useState} from 'react'
import MultiImageInput from './MultiImageInput';
import Button from "@material-ui/core/Button";
import io from 'socket.io-client';
import socketClient  from "socket.io-client";
import VideoPreview from  '@think42labs/video-preview';




function MultiImageInputRender() {
    var video = document.getElementById('videoElement')
  
  var server_url = 'http://www.mrexy.com:5000'
  var socket = socketClient(server_url)
  socket.on('detectedObject', (data) => {
    console.log('Detected an object...');
    console.log(data)
  });
  
  const dataURLtoBlob = (dataURL) => {
    var binary = atob(dataURL.split(',')[1])
      var array = []
      for (var i = 0; i < binary.length; i++) {
        array.push(binary.charCodeAt(i))
      }
      return new Blob([new Uint8Array(array)], { type: 'image/png' })
  };
  const captureImage = (e) => {
    var video = document.getElementById('videoElement')

      var canvas = document.createElement('canvas')
      canvas.width = video.offsetWidth
      canvas.height = video.offsetHeight
      canvas
        .getContext('2d')
        .drawImage(video, 0, 0, canvas.width, canvas.height)
      var data_url = canvas.toDataURL()

      return data_url
  }

  const uploadHandler = () => {
    console.log('Capturing and sending ...')
    var data_url = captureImage()
    var image_blob = dataURLtoBlob(data_url)
    socket.emit('detectFace', { data: image_blob })

  }
  
  
   
   // On file select (from the pop up)
    const onFileChange = event => {
   
     // Update the state
     setState({ selectedFile: event.target.files[0] });
   
   };
    

    const [count,setCount] = useState(1);
    const [selectedFile,setState] = useState();
    return (
        <div>

            <ul>
            {
              [...Array(count)].map(()=><MultiImageInput key={count}/>)
            }
            </ul>
            <div>
                <Button
                onClick={()=>setCount(count+1)}
                variant="contained"
                color="primary"
                size="small"
                >
                Add User
                </Button>
            </div>
            <div>
            <Button
                onClick={()=>{
                    if(count>=1)
                    setCount(count-1);
                }}
                variant="contained"
                color="primary"
                size="small"
                >
                Remove User
                </Button>
            </div>
            <div>
            <Button
                onClick={uploadHandler}
                variant="contained"
                color="primary"
                size="small"
                >
                Upload
                </Button>
            </div>

      <canvas id="bb_canvas"></canvas>
      <video autoplay controls id="videoElement">
        <source src="./test.mp4" type="video/mp4" />
      </video>
      <br />
      <hr />
      <button onclick="playVideo()" type="button">Play</button>
      <button onclick="pauseVideo()" type="button">Pause</button><br />
      <input type="file"  name="image-upload" id="input2" onChange={onFileChange} />
                <div className="label1">
                  <label className="image-upload" htmlFor="input2">
                      Add Video
                  </label>
                </div>
        <VideoPreview 
        src={selectedFile}
        size={150000}
        preview={true}
        width={520}
        height={340}
        controls={true}
        autoPlay={true}
        id="file1"
        />
        </div>
        
    )
}

export default MultiImageInputRender
