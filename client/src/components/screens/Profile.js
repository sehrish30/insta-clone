import React, {useEffect, useState, useContext, useRef} from 'react'
import {UserContext} from '../../App'
import M from "materialize-css"
import Loader from 'react-loader-spinner'


const Profile = () => {

    const [myPosts, setMyPosts] = useState(null)
    const [image, setImage] = useState("");
    // const [url, setUrl] = useState(undefined);
    const {state, dispatch} = useContext(UserContext)
    const editmodal = useRef(null);

    useEffect(()=>{
        if(image){
         const data = new FormData()
         data.append("file",image)
         data.append("upload_preset","instagram")
         data.append("cloud_name","dtxrrhfqj")
         fetch("https://api.cloudinary.com/v1_1/dtxrrhfqj/image/upload",{
             method:"post",
             body:data
         })
         .then(res=>res.json())
         .then(data=>{  
        
            fetch('/updatepic',{
                method:"put",
                headers:{
                    "Content-Type":"application/json",
                    "Authorization":"Bearer "+localStorage.getItem("jwt")
                },
                body:JSON.stringify({
                    dp:data.url
                })
            }).then(res=>res.json())
            .then(result=>{
                console.log(result)
                localStorage.setItem("user",JSON.stringify({...state,dp:result.dp}))
                dispatch({type:"UPDATEDP",payload:result.dp})
                //window.location.reload()
            })
        
         })
         .catch(err=>{
             console.log(err)
         })
        }
     },[image])

     useEffect(()=>{
        M.Modal.init(editmodal.current);
        console.log("Helloe");
     })

    const updatePhoto = (file) =>{
        setImage(file)
    }

      const uploadPhoto = (e) =>{
        updatePhoto(e.target.files[0]);
        M.Modal.getInstance(editmodal.current).close()
      }
  
    

    useEffect(()=> {
         fetch('/mypost', {
             headers: {
                 "Authorization": "Bearer "+ localStorage.getItem("jwt")
             }
         }).then(res => res.json())
           .then(result => {
            //   console.log(result.mypost); 
            setMyPosts(result.mypost)      
           })
    }, [])
    return (
        <>
        {
          !myPosts?
          (
            <Loader
            className="loader"
            type="Grid"
            color="#e23e57"
            height={100}
            width={100}
            timeout={4000} //3 secs
         />
          ):
        
        (<div className="profile">
            <div className="profile__container">
                {/* {console.log("Myposts",myPosts)} */}

                <img className="profile__dp" alt="profile dp" src={state? state.dp:""}/>
                <i  className="tiny material-icons editbtn home_icon modal-trigger"  href="#modal1" data-target="modal1"
                //   onClick={()=> updatePhoto()}
                        >create</i>
                 {/* <!-- Modal Structure --> */}
                    <div ref={editmodal} id="modal1" className="modal">
                        <div className="modal-content">
                        <div className="file-field input-field">
                        <div className="btn #d1c4e9 deep-purple lighten-4">
                            <span>Upload Dp</span>
                            <input type="file" onChange={(e)=>uploadPhoto(e)} />
                        </div>
                        <div className="file-path-wrapper">
                            <input className="file-path validate"  type="text"/>
                        </div>
                    </div>
                    <div class="modal-footer">
                    <button href="" className="modal-close waves-effect  btn-flat modelfooter-close">Close</button>
                    </div>
                        </div>
                    </div>  


                
                <div>
                    <h4>{state?.name}</h4>
                    <h6>{state?.email}</h6>
                    <div className="profile__infoSection">
                        <h6><span className="profile__details">{myPosts?.length}</span>posts</h6>
                        <h6><span className="profile__details">{state?state.followers.length:"0"}</span>followers</h6>
                        <h6><span className="profile__details">{state?state.following.length: "0"}</span>following</h6>
                    </div>
                </div>  
           </div>
          
            <div className="profile__gallery">
            {
                myPosts.map(item => {
                    return(
                        <img key={item._id} className="profile__galleryimage" alt={item.title} src={item.photo} />
                    )
                })
            }  
               
            </div>
        </div>)
        }  
      </>  
    )
}

export default Profile


// document.addEventListener('DOMContentLoaded', function() {
//     let elems = document.querySelectorAll('.modal');
//     let instances = M.Modal.init(elems);
//   });

  