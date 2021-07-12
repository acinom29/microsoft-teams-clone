    var room_id;
    var getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
    var local_stream;
 
hideMeetArea();//hiding meet area 
     
    //creating new room
    function createRoom() {
      console.log("Creating Room")
      let room = document.getElementById("room-input").value;
      if (room == " " || room == "") {
        alert("Please enter room number")
        return;
      }
      room_id = room;
      let peer = new Peer(room_id)// new peer
      peer.on('open', (id) => {
        console.log("Peer Connected with ID: ", id)
        hideModal();//hiding modal area
        showMeetArea();//unhiding meet area
        getUserMedia({ video: true, audio: true }, (stream) => {
          local_stream = stream;
          setLocalStream(local_stream)
        }, (err) => {
          console.log(err)
        })
        notify("Waiting for peer to join.")
      });
      peer.on('call', (call) => {
        call.answer(local_stream);
        call.on('stream', (stream) => {
          setRemoteStream(stream);
        });
      });
    }

//setting local stream
    function setLocalStream(stream) {
      let video = document.getElementById("local-video");
      video.srcObject = stream;
      video.muted = true;
      video.play();
}
    
//setting remote stream
    function setRemoteStream(stream) {
      let video = document.getElementById("remote-video");
      video.srcObject = stream;
      video.play();
}
    
//function to hide modal area
    function hideModal() {
      document.getElementById("entry-modal").hidden = true;
}

   // function to hide meet area  
    function hideMeetArea() {
       document.getElementsByClassName("meet-area")[0].style.display = "none";
}

    // function to unhide meet area 
     function showMeetArea() {
       document.getElementsByClassName("meet-area")[0].style.display = "block";
}
    
//notification function 
    function notify(msg) {
      let notification = document.getElementById("notification")
      notification.innerHTML = msg
      notification.hidden = false
      setTimeout(() => {
        notification.hidden = true;
      }, 3000)
    }

    //joining new peer
    function joinRoom() {
      console.log("Joining Room")
      let room = document.getElementById("room-input").value;
      if (room == " " || room == "") {
        alert("Please enter room number")
        return;
      }
      room_id = room;
      hideModal();
      showMeetArea();
      let peer = new Peer()
      peer.on('open', (id) => {
        console.log("Connected with Id: " + id)
        getUserMedia({ video: true, audio: true }, (stream) => {
          local_stream = stream;
          setLocalStream(local_stream)
          notify("Joining peer")
          let call = peer.call(room_id, stream)
          call.on('stream', (stream) => {
            setRemoteStream(stream);
          })
        }, (err) => {
          console.log(err)
        });
      });
    }