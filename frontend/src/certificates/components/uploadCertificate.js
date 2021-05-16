import React, { useRef } from "react";
import Button from "@material-ui/core/Button";
import CloudUploadIcon from "@material-ui/icons/CloudUpload";
import "./uploadCertificate.css";

const UploadCertificate = (props) => {
  const filePickerRef = useRef();
  const pickedHandler = (event) => {
    console.log(event.target);
  };
  const pickImageHandler = () => {
    filePickerRef.current.click();
  };
  return (
    <>
      <input
        ref={filePickerRef}
        style={{ display: "none" }}
        accept="image/*"
        // className={classes.input}
        id="contained-button-file"
        type="file"
        multiple
        name="CertificateImage"
        onChange={pickedHandler}
        // onChange={(event) => {
        //   fProps.setFieldValue("CertificateImage", event.target.files[0]);
        // }}
      />
      <div className={`.image-upload${props.center && "center"}`}>
        <div className=".image-upload__preview">
          <img src="" alt="Preview" />
        </div>
        <label htmlFor="contained-button-file">
          <Button
            startIcon={<CloudUploadIcon />}
            variant="contained"
            color="secondary"
            component="span"
            onClick={pickImageHandler}
          >
            Attach Certificate
          </Button>
        </label>
      </div>
    </>
  );
};

export default UploadCertificate;
