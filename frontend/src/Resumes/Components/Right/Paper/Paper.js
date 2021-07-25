import React from "react";
import HeaderP from "./HeaderP";
import ProfessionalP from "./ProfessionalP";
import EducationP from "./EducationP";
import AdditionalSkillsP from "./AdditionalSkillsP";
import { Grid } from "@material-ui/core";

function Paper() {
  return (
    <Grid item >
      <div className="page">
        <HeaderP />
        <ProfessionalP />
        <EducationP />
        <AdditionalSkillsP />
      </div>
      </Grid>
  );
}

export default Paper;
