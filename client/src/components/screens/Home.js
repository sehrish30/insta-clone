import React, {useState, useEffect, useContext} from 'react'
import {UserContext} from "../../App"
import Profile from './Profile';
import {Link} from "react-router-dom"
import Loader from 'react-loader-spinner'


const Home = () => {

    const [data, setData] = useState([]);
    const {state, dispatch} = useContext(UserContext);


    useEffect(()=> {
      fetch('/allpost', {
          headers: {
              "Authorization": "Bearer "+localStorage.getItem("jwt")
          }
      }).then(res=> res.json())
        .then(result => {   
            // console.log("Iam result",result.posts);
        
            setData(result.posts); 
            // console.log("Iam data",data);
        } )
    }, [])

    const likePost =(id)=>{
       fetch('/like', {
           method: "put",
           headers: {
               "Content-Type": "application/json",
               "Authorization": "Bearer "+localStorage.getItem("jwt")
           },
           body: JSON.stringify({
               postId: id
           })
        }).then(res => res.json())
             .then(result => {
                //  console.log(result);
                 const newData = data.map(item => {
                     if(item._id === result._id){
                         return result
                     }
                     return item
                 })
                 setData(newData);
             }).catch(err => {
                 console.log(err)
             })
             
    }

    const unlikePost =(id)=>{
        fetch('/unlike', {
            method: "put",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer "+localStorage.getItem("jwt")
            },
            body: JSON.stringify({
                postId: id
            })
         }).then(res => res.json())
              .then(result => {
                // console.log(result);
                const newData = data.map(item => {
                    if(item._id === result._id){
                        return result
                    }
                    return item
                })
                setData(newData);
              }).catch(err => {
                console.log(err)
            })
     }

     const postComment = (text, postId) =>{
         fetch('/comment', {
             method: "put",
             headers: {
                 "Content-Type": "application/json",
                 "Authorization": "Bearer "+localStorage.getItem("jwt")
             },
             body: JSON.stringify({
                postId,
                text 
             })
         }).then(res => res.json())
           .then(result => {
            //    console.log(result);
               const newData = data.map(item => {
                if(item._id === result._id){
                    return result
                }
                return item 
            })
             setData(newData)
           }).catch(err => {
               console.log(err);
           })
     }

     const deletePost = (postid) => {
         fetch(`/deletepost/${postid}`, {
             method: "delete",
             headers: {
                 Authorization: "Bearer "+localStorage.getItem("jwt")
             }
         }).then(res => res.json())
           .then(result => {
            //    console.log(result);
               const newData = data.filter(item=>{
                   return item._id !== result._id
               })
               setData(newData);
           })
     }

     const deleteComment = (commentid, postid)=>{
         fetch(`/deletecomment/${commentid}`, {
             method: "delete",
             headers: {
                 Authorization: "Bearer "+localStorage.getItem("jwt")
             }
         }).then(res => res.json())
           .then(result => {
            //    console.log("I am the result",result);

               const newData = data.map(item =>{
                   if(item._id === result._id){
                       return result
                   }
                   return item
               })
               setData(newData);

                 }).catch(err => {
                     console.log(err)
                 })               
           }
    return (
       <> 
       {
          data.length===0?(
            <Loader
            className="loader"
            type="Grid"
            color="#e23e57"
            height={100}
            width={100}
            timeout={4000} //3 secs
         />
          ) :(
        <div className="home">
            {data.map(item => {
                return(
                 <div className="card home__card" key={item._id}>
                    
                    <h5 className="home__PostedBy">
                    <div className="topdp">     
                     <img className="profile__dpofPost" alt="profile dp" src={item.postedBy.dp}/> 
                   
                        <Link className="profile__Name" to={item.postedBy._id !== state._id?`/profile/${item.postedBy._id}`: `/profile`}>{item.postedBy.name}</Link>
                        {item.postedBy._id === state._id && (
                       <i className="tiny material-icons post_delbtn home_icon"
                       onClick={()=> deletePost(item._id)}
                       >delete_forever</i>
                    )}

                     </div>      
                   
                    </h5>
                 
                   
                    <div className="card-image home__cardImage">
                      <img className="home__Image" alt="homeCard" src={item.photo} />
                    </div>
                    <div className="card-content">
                        <i className="tiny material-icons home_btn home_icon">favorite</i>

                           {item.likes.includes(state._id)
                            ? 
                            (<i className="tiny material-icons home_btn home_icon"
                            onClick={()=> {unlikePost(item._id)}}>thumb_down</i>
                            ):
                            ( <i className="tiny material-icons home_btn home_icon"
                            onClick={()=> {likePost(item._id)}}>thumb_up</i>)}

                       
                        <h6 className="home_postLikes">{item.likes.length} likes</h6>
                        <h5 className="home__cardTitle">{item.title}</h5>
                        <p className="home__carddesc">{item.body}</p>
                        <h5 className="home__commentsTitle">Comments</h5>
                        {
                            item.comments.map(record => {
                                return(
                                <h6 className="home__commentsdesc" key={record._id}><span className="home__commentsname">{record.postedBy.name}|</span>
                                <i class="tiny material-icons home_delbtn home_icon"
                                    onClick={()=> deleteComment(record._id,item._id)}
                                    >delete_forever</i>
                                  {record.text}
                                </h6>
                                )
                            })
                        }
                        <form onSubmit={(e)=>{
                            e.preventDefault()
                            postComment(e.target[0].value, item._id)
                            // console.log(e.target)
                        }}>
                          <input type="text" placeholder="add a comment"/>
                        </form>
                    </div>
                </div>  
                )
            })}
           
        </div>
          )
       } 
      </>   
    )
}

export default Home
