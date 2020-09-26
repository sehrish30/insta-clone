import React, {useContext, useState} from 'react'
import { Link, useHistory, useLocation } from 'react-router-dom';
import M from "materialize-css";
import "../App.css"
import {useMediaQuery} from "../misc/customhooks";
import {UserContext} from "../App"

const Navbar = () => {

  
  const location = useLocation();
  // console.log("I am location", location);

  const {state, dispatch} = useContext(UserContext);
  const [activeLink, setActiveLink] = useState(null)
  const history =useHistory();
  const DelUser = () =>{
    localStorage.clear();
    dispatch({type: "CLEAR"})
    history.push("/signin");
   }
  

  const renderList =()=>{
    if(state){
      return [
        <li><Link className={location.pathname==="/" && 'active' } to="/">Explore</Link></li>,
        <li><Link className={location.pathname==="/followingposts" && 'active' } to="/followingposts">Home</Link></li>,    
        <li><Link className={location.pathname==="/profile" && 'active' } to="/profile">Profile</Link></li>,
        <li><Link className={location.pathname==="/create" && 'active' } to="/create">Create Post</Link></li>,     
        <button onClick={DelUser} className="btn waves-effect waves-light #4a148c purple darken-4 nav__btn" type="submit" name="action">
                Sign Out
        </button>
      ]
    }else{
      return [
        <li><Link className={location.pathname==="/signin" && 'active' } to="/signin">Login</Link></li>,
        <li><Link className={location.pathname==="/signup" && 'active' } to="/signup">Signup</Link></li>
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
            <ul id="slide-out"  className="sidenav show-on-large">        
              {renderList()}
            </ul>
          </div>
        </>
        ): (

        <div className="nav-wrapper navbar">
      
        <Link to="/" className="brand-logo left navbar__logo">Instagram</Link>
        <ul id="nav-mobile" className="right">  
        {renderList()}
        </ul>
      </div>
        )
      }
    
  </nav>
    )
}

export default Navbar

// const open = ()=>{

// }

document.addEventListener('DOMContentLoaded', function() {
  let elems = document.querySelectorAll('.sidenav');
  let instances = M.Sidenav.init(elems);
});

// Initialize collapsible (uncomment the lines below if you use the dropdown variation)
// var collapsibleElem = document.querySelector('.collapsible');
// var collapsibleInstance = M.Collapsible.init(collapsibleElem, options);

// Or with jQuery

// $(document).ready(function(){
//   $('.sidenav').sidenav();
// });
