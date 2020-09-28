import React, {useState, useContext} from 'react'
import { Link, useHistory } from 'react-router-dom'
import M from "materialize-css"

const Reset = () => {

  const history = useHistory();
  const [email, setEmail] = useState("");
  const [disable, setDisable] = useState(false);

  const PostData = (event) => {

   event.preventDefault();
   if(!/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email)){
       M.toast({html: "invalid email", classes: "#f44336 red"});
       return;
   }
   setDisable(true);
    fetch("/reset-password", {
      method: "post",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        email
      })
    }).then(res => res.json())
      .then(data => {
        // console.log(data);
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
            <button onClick={PostData} disabled={disable} className="btn waves-effect waves-light mycard__btn" type="submit" name="action">
                Reset Password
            </button>
          </div>
        </div>
    )
}

export default Reset
