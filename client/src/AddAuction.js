import { useState } from "react";

function AddAuction(props) {
  const {addAuction} = props;

  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [duration, setDuration] = useState("");

  //call the function with the entered details from the input fields
  function onSubmit() {
    addAuction(title, desc, duration);
  }

  return (
    <>
      <h3>Create a new auction</h3>

      <input onChange={(event) => setTitle(event.target.value)} 
        type="text" name="title" placeholder="Title here"></input> <br/>
      <input onChange={(event) => setDesc(event.target.value)} 
        type="text" name="desc" placeholder="Description here"></input> <br/>
      <input onChange={(event) => setDuration(event.target.value)} 
        type="number" name="duration" placeholder="Duration"></input> <br/>

      <button type="button" onClick={() => onSubmit()}>
          Start the Auction
      </button>
    </>
  );
}

export default AddAuction;