import React, { useContext } from "react";
import classes from "./Template.module.css";
import { ResumeContext } from "../../../Contexts/ResumeContext";

function HeaderP() {
  const { content, control, contentFake } = useContext(ResumeContext);

  //If the "control" is TRUE - use "Fake State" to show the example on the page
  let contentUse;
  if (control) {
    contentUse = contentFake;
  } else {
    contentUse = content;
  }

  let divider;
  if (Object.keys(contentUse.header).length > 0) {
    divider = <hr className={classes.dividerRight} />;
  } else {
    divider = "";
  }

  return (
    <div>
      <div className={classes.headerResume}>
        <div className={classes.contentHeader}>
          <h1>
            {contentUse.header.firstname} {contentUse.header.lastname}
           </h1>
          <p>
          {contentUse.header.address}
            <br />
            {contentUse.header.email}
            <br />
           {contentUse.header.country} {contentUse.header.city}
            <br />
            {contentUse.header.phone}
            <br />       
          </p>
          {divider}
        </div>
      </div>
    </div>
  );
}

export default HeaderP;
