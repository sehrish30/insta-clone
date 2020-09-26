import React, {useState, useEffect} from 'react'
import {Link, useHistory} from 'react-router-dom'
import M from "materialize-css"


const Signup = () => {

  const history = useHistory();
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [disable, setDisable] = useState(false);
  const [image, setImage] = useState("");
  const [url, setUrl] = useState(undefined); // undefined because we have default image in mongo db than this wont get added

  useEffect(()=>{
    if(url){
       UploadFields();
    }
  },[url])

  const UploadDp =()=>{
       
        setDisable(true);

        const data = new FormData();
        data.append("file",image)
        data.append("upload_preset","instagram")
        data.append("cloud_name","dtxrrhfqj")
        fetch("https://api.cloudinary.com/v1_1/dtxrrhfqj/image/upload",{
           method:"POST",
           body:data
        })
       
         .then(res => res.json())
         .then(data => {
            setUrl(data.secure_url);
         })
         .catch(err => {
             console.log(err);
         })
  }

  const UploadFields =()=>{
     
   if(!/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email)){
    M.toast({html: "invalid email", classes: "#f44336 red"});
    return;
    }
    setDisable(true);
    fetch("/signup", {
      method: "post",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        name,
        password,
        email,
        dp:url
      })
    }).then(res => res.json())
      .then(data => {
        if(data.error){
          M.toast({html: data.error, classes: "#f44336 red"})
          setDisable(false);
        }else{
          M.toast({html: data.message, classes: "#00e5ff cyan accent-3"});
          history.push('/signin');
        }
      }).catch(err => {
        console.log(err);
      })
  }

  const PostData = (event) => {
   event.preventDefault();

   if(image){
     UploadDp();
   }else{
     UploadFields()
   }

  }

    return (
        <div className="mycard">
        <div className="card mycard__auth input-field">
          <h2 className="mycard__header">Instagram</h2>
          <input
          type="text"
          placeholder="Name"
          value={name}
          onChange = {e => setName(e.target.value)}
          />
          <input
          type="email"
          placeholder="Email"
          value={email}
          onChange = {e => setEmail(e.target.value)}
          />
          <input
          type="password"
          placeholder="password"
          value={password}
          onChange = {e => setPassword(e.target.value)}
          />
          <div className="file-field input-field">
            <div className="btn #d1c4e9 deep-purple lighten-4">
                <span>Upload Dp</span>
                <input type="file" onChange={(e) => setImage(e.target.files[0])}/>
            </div>
            <div className="file-path-wrapper">
                <input className="file-path validate" type="text"/>
            </div>
          </div>
         
          <button disabled={disable} onClick={PostData} className="btn waves-effect waves-light mycard__btn" type="submit" name="action">
              Sign Up
          </button>
          <h5>
              <Link to="/signin">Already have an account?</Link>
          </h5>
        </div>
      </div>
    )
}

export default Signup
