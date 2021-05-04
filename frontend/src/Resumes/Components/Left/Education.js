import React, { useState, useContext } from "react";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import classes from "./Left.module.css";
import { useForm } from "react-hook-form";
import { ResumeContext } from "../../Contexts/ResumeContext";

function Education(props) {
  const { content, updateEducationData, removeFakeData } = useContext(
    ResumeContext
  );
  const [btnText, setBtnText] = useState("Add");

  const { register, handleSubmit } = useForm();
  const onSubmit = (data) => {
    removeFakeData();
    updateEducationData(data);
    setBtnText("Update");
  };

  return (
    <div className="">
      <h2>Education</h2>
      <form
        className={classes.formStyle}
        noValidate
        autoComplete="off"
        onSubmit={handleSubmit(onSubmit)}
      >
        <TextField
          id="outlined-basic"
          label="Institution"
          name="institution"
          variant="outlined"
          defaultValue={content.education.institution}
          inputRef={register}
          // onChange={handleSubmit(onSubmit)}
          style={{ marginTop: 12, marginLeft: 8, marginRight: 8 }}
        />

        <TextField
          id="outlined-basic"
          label="City"
          name="city"
          variant="outlined"
          defaultValue={content.education.city}
          inputRef={register}
          // onChange={handleSubmit(onSubmit)}
          style={{ marginTop: 12, marginLeft: 8, marginRight: 8 }}
        />
        <TextField
          id="outlined-basic"
          label="Graduation Year"
          name="gradYear"
          variant="outlined"
          defaultValue={content.education.gradYear}
          inputRef={register}
          // onChange={handleSubmit(onSubmit)}
          style={{ marginTop: 12, marginLeft: 8, marginRight: 8 }}
        />

        <TextField
          id="outlined-basic"
          label="Additional Info"
          name="additional"
          variant="outlined"
          defaultValue={content.education.additional}
          inputRef={register}
          // onChange={handleSubmit(onSubmit)}
          style={{ marginTop: 12, marginLeft: 8, marginRight: 8 }}
        />

        <Button
          variant="contained"
          color="secondary"
          type="submit"
          style={{ marginTop: 12, marginLeft: 8, marginRight: 8 }}
        >
          {btnText}
        </Button>
      </form>
    </div>
  );
}

export default Education;
