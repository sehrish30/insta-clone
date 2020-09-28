
import React, {useState, useContext} from 'react'
import { Link, useHistory, useParams } from 'react-router-dom'
import M from "materialize-css"

const Newpassword = () => {

  const history = useHistory();
  const [password, setPassword] = useState("");
  const [disable, setDisable] = useState(false);

  const {token} =useParams()
  console.log(token);

  const PostData = (event) => {

   event.preventDefault();
   setDisable(true);
    fetch("/new-password", {
      method: "post",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        password,
        token
      })
    }).then(res => res.json())
      .then(data => {
        console.log(data);
        if(data.error){
          M.toast({html: data.error, classes: "#f44336 red"})
          setDisable(false);
        }else{
      
          M.toast({html: data.message, classes: "#00e5ff cyan accent-3"});
          history.push('/signin');
        }
      }).catch(err => {
        console.log(err);
        setDisable(false);
      })
  }

    return (
        <div className="mycard">
          <div className="card mycard__auth input-field">
            <h2 className="mycard__header">Instagram</h2>

            <input
            type="password"
            placeholder="New password"
            value={password}
            onChange = {e => setPassword(e.target.value)}
            />
            <button onClick={PostData} disabled={disable} className="btn waves-effect waves-light mycard__btn" type="submit" name="action">
                Change Password
            </button>
            <h5>
              <Link to="/signup">Create an account?</Link>
            </h5>
          </div>
        </div>
    )
}

export default Newpassword
