import React, {useState, useContext} from 'react'
import { Link, useHistory } from 'react-router-dom'
import {UserContext} from '../../App'
import M from "materialize-css"

const Signin = () => {

  const {state, dispatch} = useContext(UserContext);
  const history = useHistory();
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [disable, setDisable] = useState(false);

  const PostData = (event) => {

   event.preventDefault();
   if(!/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email)){
       M.toast({html: "invalid email", classes: "#f44336 red"});
       return;
   }
   setDisable(true);
    fetch("/signin", {
      method: "post",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        password,
        email
      })
    }).then(res => res.json())
      .then(data => {
        // console.log(data);
        if(data.error){
          M.toast({html: data.error, classes: "#f44336 red"})
          setDisable(false);
        }else{
          localStorage.setItem("jwt", data.token)
          localStorage.setItem("user" , JSON.stringify(data.user));
          dispatch({type: "USER", payload: data.user})
          M.toast({html: "Signed in successfully", classes: "#00e5ff cyan accent-3"});
          history.push('/');
        }
      }).catch(err => {
        console.log(err);
      })
  }

    return (
        <div className="mycard">
          <div className="card mycard__auth input-field">
            <h2 className="mycard__header">Instagram</h2>
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
            <button onClick={PostData} disabled={disable} className="btn waves-effect waves-light mycard__btn" type="submit" name="action">
                Sign In
            </button>
            <h5>
              <Link to="/signup">Create an account?</Link>
            </h5>
            
              <Link to="/reset"><h6 className="forgotPw">Forgot Password?</h6></Link>

          </div>
        </div>
    )
}

export default Signin
