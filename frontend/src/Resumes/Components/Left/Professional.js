import React, { useState, useContext } from "react";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import classes from "./Left.module.css";
import { useForm } from "react-hook-form";
import { ResumeContext } from "../../Contexts/ResumeContext";
import { Paper } from "@material-ui/core";

function Professional() {
  const { content, updateProfessionalData, removeFakeData } = useContext(
    ResumeContext
  );
  const [btnText, setBtnText] = useState("Add");

  const { register, handleSubmit } = useForm();
  const onSubmit = (data) => {
    removeFakeData();
    updateProfessionalData(data);
    setBtnText("Update");
  };
  return (
    <>
      <h2>Professional Experience</h2>
      <form
        className={classes.formStyle}
        noValidate
        autoComplete="off"
        onSubmit={handleSubmit(onSubmit)}
      >
        <h4>Company </h4>
        <TextField
          id="outlined-basic"
          label="Company"
          name="company"
          variant="outlined"
          defaultValue={content.professional.company}
          inputRef={register}
          // onChange={handleSubmit(onSubmit)}
          style={{ marginTop: 12, marginLeft: 8, marginRight: 8 }}
        />

        <TextField
          id="outlined-basic"
          label="Position"
          name="position"
          variant="outlined"
          defaultValue={content.professional.position}
          inputRef={register}
          // onChange={handleSubmit(onSubmit)}
          style={{ marginTop: 12, marginLeft: 8, marginRight: 8 }}
        />

        <TextField
          id="outlined-basic"
          label="Start MM/YYYY"
          name="start"
          variant="outlined"
          defaultValue={content.professional.start}
          inputRef={register}
          // onChange={handleSubmit(onSubmit)}
          style={{ marginTop: 12, marginLeft: 8, marginRight: 8 }}
        />

        <TextField
          id="outlined-basic"
          label="End MM/YYYY"
          name="end"
          variant="outlined"
          defaultValue={content.professional.end}
          inputRef={register}
          // onChange={handleSubmit(onSubmit)}
          style={{ marginTop: 12, marginLeft: 8, marginRight: 8 }}
        />

        <TextField
          id="outlined-basic"
          label="Description"
          name="desc"
          multiline
          variant="outlined"
          defaultValue={content.professional.desc}
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
</>
  );
}

export default Professional;
