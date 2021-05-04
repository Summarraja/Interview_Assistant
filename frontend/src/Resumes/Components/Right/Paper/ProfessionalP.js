import React, { useContext } from "react";
import classes from "./Template.module.css";
import { ResumeContext } from "../../../Contexts/ResumeContext";

function ProfessionalP() {
  const { content, control, contentFake } = useContext(ResumeContext);

    //If the "control" is TRUE - use "Fake State" to show the example on the page
  let contentUse;
  if (control) {
    contentUse = contentFake;
  } else {
    contentUse = content;
  }

  //If there is no data, the Title of the section will not be displayed
  let title;
  if (Object.keys(contentUse.professional).length < 3) {
    title = "";
  } else {
    title = (
      <h3>
        <strong>Professional Experience</strong>
      </h3>
    );
  }

  let bulletProfessional;
  if (!contentUse.professional.desc) {
    bulletProfessional = "";
  } else {
    bulletProfessional = (
      <ul>
        <li>{contentUse.professional.desc}</li>
      </ul>
    );
  }


  return (
    <div className={classes.professionalResume}>
      <div className="">
        {title}
        <p>
          <strong>{contentUse.professional.company}</strong>{" "}
          {contentUse.professional.local}
        </p>
        <p>
          {contentUse.professional.position}
          </p>   
          <p>{contentUse.professional.start}
          </p>
          <p>
          {contentUse.professional.end}
          </p>      
           {bulletProfessional}   
      </div>
    </div>
  );
}

export default ProfessionalP;
