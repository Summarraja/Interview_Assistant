
import React, { useContext } from "react";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import classes from "./Left.module.css";
import { useForm } from "react-hook-form";
import { ResumeContext } from "../../Contexts/ResumeContext";
import { Paper } from "@material-ui/core";
import Education from "./Education";

export default function Header() {
  const { content, updateHeaderData, removeFakeData } = useContext(
    ResumeContext
  );

  const { register, handleSubmit} = useForm();
  const onSubmit = (data) => {
    removeFakeData();
    updateHeaderData(data);
  };

  return (
<>
     <h2>Header</h2>   
      <form
        className={classes.formStyle}
        autoComplete="off"
        noValidate
       // onSubmit={handleSubmit(onSubmit)}
      >
        <TextField
          id="outlined-basic"
          label="FirstName"
          name="firstname"
          required
          variant="outlined"
          defaultValue={content.header.firstname}
          inputRef={register}
          onChange={handleSubmit(onSubmit)}
          style={{ marginTop: 12, marginLeft: 8, marginRight: 8 }}
        />
      
         <TextField
          id="outlined-basic"
          label="LastName"
          name="lastname"
          required
          variant="outlined"
          defaultValue={content.header.lastname}
          inputRef={register}
           onChange={handleSubmit(onSubmit)}
          style={{ marginTop: 12, marginLeft: 8, marginRight: 8 }}
        />
       <TextField
          id="outlined-basic"
          label="E-mail"
          name="email"
          required
          type="email"
          variant="outlined"
          defaultValue={content.header.email}
          inputRef={register}
           onChange={handleSubmit(onSubmit)}
          style={{ marginTop: 12, marginLeft: 8, marginRight: 8 }}
        />

<TextField
          id="outlined-basic"
          label="Phone"
          name="phone"
          required
          type="number"
          variant="outlined"
          defaultValue={content.header.phone}
          inputRef={register}
           onChange={handleSubmit(onSubmit)}
          style={{ marginTop: 12, marginLeft: 8, marginRight: 8 }}
        />

        <TextField
          id="outlined-basic"
          label="Address"
          name="address"
          required
          variant="outlined"
          defaultValue={content.header.address}
          inputRef={register}
          onChange={handleSubmit(onSubmit)}
          style={{ marginTop: 12, marginLeft: 8, marginRight: 8 }}
        />

        <TextField
          id="outlined-basic"
          label="City"
          name="city"
          required
          variant="outlined"
          defaultValue={content.header.city}
          inputRef={register}
          onChange={handleSubmit(onSubmit)}
          style={{ marginTop: 12, marginLeft: 8, marginRight: 8 }}
        />

        <TextField
          id="outlined-basic"
          label="Country"
          name="country"
          required
          variant="outlined"
          defaultValue={content.header.country}
          inputRef={register}
          onChange={handleSubmit(onSubmit)}
          style={{ marginTop: 12, marginLeft: 8, marginRight: 8 }}
        />
        {/* <Button
          variant="contained"
          color="secondary"
          type="submit"
          style={{ margin: 8 }}
        //  onClick={onclickhandler}
        >
          Update
        </Button> */}
      </form>
      
   </>
  );
}
