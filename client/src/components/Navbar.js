import React, {useContext, useState, useRef, useEffect} from 'react'
import { Link, useHistory, useLocation } from 'react-router-dom';
import M from "materialize-css";
import "../App.css"
import {useMediaQuery} from "../misc/customhooks";
import {UserContext} from "../App"

const Navbar = () => {

  const [search, setSearch] = useState(null);
  const [searchedUsers, setSearchedUsers] = useState([])
  const searchModal = useRef(null);
  const showOnMobile = useRef(null);
  const location = useLocation();
  // console.log("I am location", location);

  useEffect(()=>{
    M.Modal.init(searchModal.current);
    M.Sidenav.init(showOnMobile.current);
  },[])

  // function openmodal() {
  //   let elems = document.querySelectorAll('.modal');
  //   let instances = M.Modal.init(elems);
  //   console.log("open")
  // }

  const fetchUsers = (query)=>{
    setSearch(query)
    fetch('/search-users', {
      method: "post",
      headers:{
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query
      })
    }).then(res => res.json())
       .then(results => {
        setSearchedUsers(results.user)
       })
  }


  const {state, dispatch} = useContext(UserContext);
  const [activeLink, setActiveLink] = useState([null])
  const history =useHistory();
  const DelUser = () =>{
    localStorage.clear();
    dispatch({type: "CLEAR"})
    history.push("/signin");
   }
  

  const renderList =()=>{
    if(state){
      return [
        <li key="1"><i data-target="modal2"  className="medium material-icons modal-trigger searchbtn">search</i></li>,
        <li key="2"><Link className={location.pathname==="/" && 'active' } to="/">Explore</Link></li>,
        <li key="3"><Link className={location.pathname==="/followingposts" && 'active' } to="/followingposts">Home</Link></li>,    
        <li key="4"><Link className={location.pathname==="/profile" && 'active' } to="/profile">Profile</Link></li>,
        <li key="5"><Link className={location.pathname==="/create" && 'active' } to="/create">Post</Link></li>,     
        <button key="8" onClick={DelUser} className="btn waves-effect waves-light #4a148c purple darken-4 nav__btn" type="submit" name="action">
                Sign Out
        </button>
      ]
    }else{
      return [
        <li key="6"><Link className={location.pathname==="/signin" && 'active' } to="/signin">Login</Link></li>,
        <li key="7"><Link className={location.pathname==="/signup" && 'active' } to="/signup">Signup</Link></li>
      ]
    }
  }

  const isMobile = useMediaQuery('(max-width: 992px)');
    return (
        <nav>
          {
         isMobile ? (
         <>
            <Link to="#" data-target="slide-out" className="sidenav-trigger"><i className="material-icons">menu</i></Link>    
            <div  className="nav-wrapper navbar">
            <Link to={state? "/": "/signin"} className="brand-logo center navbar__logo">Instagram</Link>  
            <ul id="slide-out" ref={showOnMobile} className="sidenav show-on-large">        
              {renderList()}
            </ul>
          </div>
          {/* <!-- Modal Structure --> */}
          <div id="modal2" className="modal searchModal" ref={searchModal}>
          <div className="modal-content">
          <input id="inputSearch" autocomplete="off" type="search" placeholder="Search Users" value={search} onChange={e => fetchUsers(e.target.value)} />
            <div id="users__collection" className="collection">
              {searchedUsers.map(item => {
                 return (
                  <Link to={item._id !== state._id ?`/profile/${item._id}`: `/profile`} onClick={()=>{
                            M.Modal.getInstance(searchModal.current).close()
                            setSearch("");
                  }}>
                    <li key={item._id} className="collection-item avatar">
                      <img src={item.dp} alt="" className="circle"/>
                      <p className="users_name">{item.email}</p>
                    </li>
                 </Link>
                 )
              })}
             </div>
            </div>
             
            <div className="modal-footer searchModal__footer">
              <button href="#!" className="modal-close waves-effect waves-green btn-flat">Close</button>
            </div>
          </div>
        </>
          ): (
        <div className="nav-wrapper navbar">
      
        <Link to="/" className="brand-logo left navbar__logo">Instagram</Link>
        <ul id="nav-mobile" className="right">  
        {renderList()}
        </ul>
        <div id="modal2" className="modal searchModal" ref={searchModal}>
          <div className="modal-content">
            <input id="inputSearch" autocomplete="off" type="search" placeholder="Search Users" value={search} onChange={e => fetchUsers(e.target.value)} />
            <div id="users__collection" className="collection">
              {searchedUsers.map(item => {
                 return (
                  <Link to={item._id !== state._id ?`/profile/${item._id}`: `/profile`} onClick={()=>{
                            M.Modal.getInstance(searchModal.current).close()
                            setSearch("");
                  }}>
                    <li key={item._id} className="collection-item avatar">
                      <img src={item.dp} alt="" className="circle"/>
                      <p className="users_name">{item.email}</p>
                    </li>
                 </Link>
                 )
              })}
             </div>
            </div>
             
            <div className="modal-footer searchModal__footer">
              <button href="" className="modal-close waves-effect close-btn btn-flat" onClick={()=> setSearch("")}>Close</button>
            </div>
          </div>
      </div>
        )
      }
    
  </nav>
    )
}

export default Navbar

// const open = ()=>{

// }



// document.addEventListener('DOMContentLoaded', function() {
//   let elems = document.querySelectorAll('.sidenav');
//   let instances = M.Sidenav.init(elems);
// });
