import React, {useEffect, useState, useContext} from 'react'
import {UserContext} from '../../App'
import {useParams} from "react-router-dom"
import Loader from 'react-loader-spinner'

const UserProfile = () => {

    const [userPosts, setUserPosts] = useState(null)
   
    const {state, dispatch} = useContext(UserContext)
    const {userid} = useParams()
    const [showFollow, setShowFollow] = useState(state?!state.following.includes(userid): true);

    useEffect(()=> {
         fetch(`/user/${userid}`, {
             headers: {
                 "Authorization": "Bearer "+ localStorage.getItem("jwt")
             }
         }).then(res => res.json())
           .then(result => {
            console.log(result);
            setUserPosts(result)
           })
    }, [])


    const followUser = () => { 
        fetch('/follow', {
            method: "put",
            headers:{
             "Content-Type": "application/json",
             "Authorization": "Bearer "+localStorage.getItem("jwt")
            },
            body: JSON.stringify({
             followId: userid
            })
        }).then(res => res.json())
          .then(data => {
            //   console.log(data);
              dispatch({type:"UPDATE",payload:{following:data.following,followers:data.followers}})
              localStorage.setItem("user", JSON.stringify(data))
              setUserPosts((prevState)=> {
                  return {
                      ...prevState,
                      user: {
                          ...prevState.user,
                          followers: [...prevState.user.followers, data._id]
                      }
                  }
              })
          })
          setShowFollow(false);
    }    

    const unfollowUser = () => { 
        fetch('/unfollow', {
            method: "put",
            headers:{
             "Content-Type": "application/json",
             "Authorization": "Bearer "+localStorage.getItem("jwt")
            },
            body: JSON.stringify({
             unfollowId: userid
            })
        }).then(res => res.json())
          .then(data => {
            //   console.log(data);  
              dispatch({type: "UPDATE", payload: {following: data.following, followers: data.followers}})
              localStorage.setItem("user", JSON.stringify(data))
              
              setUserPosts((prevState)=> {
                const newFollowers = prevState.user.followers.filter(item =>  item !== data._id)
                  return {
                      ...prevState,
                      user: {
                          ...prevState.user,
                          followers: newFollowers
                      }
                  }
              })
          })
          setShowFollow(true);
    }    


    return (
        <>
        {!userPosts?
          <Loader
          className="loader"
          type="Grid"
          color="#e23e57"
          height={100}
          width={100}
          timeout={4000} //3 secs
       />
         :
         (
            <div className="profile">
            <div className="profile__container">

                <img alt="profile dp" src={userPosts.user.dp} className="profile__dp"/>
           
                <div>
                    <h4>{userPosts?.user.name}</h4>
                    <h6>{userPosts?.user.email}</h6>
                    <div className="profile__infoSection">
                        <h6><span className="profile__details">{userPosts?.posts.length}</span>posts</h6>
                        <h6><span className="profile__details">{userPosts?.user.followers.length}</span>followers</h6>
                        <h6><span className="profile__details">{userPosts?.user.following.length}</span>following</h6>
                    </div>
                    {showFollow ?
                    ( <button onClick={()=> followUser()} className="btn waves-effect waves-light follow__btn" type="submit" name="action">
                        Follow
                    </button>):
                    (             
                    <button onClick={()=> unfollowUser()} className="btn waves-effect waves-light follow__btn" type="submit" name="action">
                        unFollow
                    </button>
                    )
                    }
                    
                </div>  
           </div>
          
            <div className="profile__gallery">
            {
                userPosts?.posts.map(item => {
                    return(
                        <img key={item._id} className="profile__galleryimage" alt={item.title} src={item.photo} />
                    )
                })
            }  
               
            </div>
        </div>
         )
         }
        
      </>  
    )
}

export default UserProfile
