import React, {useState, useEffect} from 'react'
import { useHistory } from 'react-router-dom'
import M from "materialize-css"

const CreatePost = () => {

  

    const history = useHistory();
    const [title, setTitle] = useState("");
    const [body, setBody] = useState("");
    const [image, setImage] = useState("");
    const [url, setUrl] = useState("");
    const [disable, setDisable] = useState(false);

    useEffect (()=> {
      if(url){
      fetch("/createpost", {
        method: "post",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer "+localStorage.getItem("jwt")
        },
        body: JSON.stringify({
          title,
          photo:url,
          body
        })
      }).then(res => res.json())
        .then(data => {
          console.log(data);
          if(data.error){
            M.toast({html: data.error, classes: "#f44336 red"})
            setDisable(false);
          }else{
            M.toast({html: "Posted successfully", classes: "#00e5ff cyan accent-3"});
            history.push('/');
          }
        }).catch(err => {
          console.log(err);
          setDisable(false)
        }) 
      } 
    }, [url])

    const postDetails = (e) => {

        e.preventDefault();
       
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
            setDisable(false)
         })
         .catch(err => {
             console.log(err);
             setDisable(false);
         })

        
    }

    return (
        <div className="card input-field createPost">
          <input
           type="text"
           placeholder="title"
           onChange={(e) => setTitle(e.target.value)}
           value={title}
           />
          <input
           type="text"
            placeholder="body"
            onChange={(e) => setBody(e.target.value)}
            value={body}
             />
          <div className="file-field input-field">
            <div className="btn #d1c4e9 deep-purple lighten-4">
                <span>Upload Image</span>
                <input type="file" onChange={(e) => setImage(e.target.files[0])}/>
            </div>
            <div className="file-path-wrapper">
                <input className="file-path validate" type="text"/>
            </div>
          </div>
        <button disabled={disable} onClick={postDetails} className="btn waves-effect waves-light mycard__btn" type="submit" name="action">
            POST
        </button>
        </div>
    )
}

export default CreatePost
