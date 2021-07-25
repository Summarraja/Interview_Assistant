import React, { createContext, useState, useEffect,useContext } from "react";
import fakeData from "./fake_data";
import { AuthContext } from "../../shared/context/auth-context";

export const ResumeContext = createContext();

const ResumeContextProvider = (props) => {
  const auth = useContext(AuthContext);

  //If there is no data stored in localStorage, then use the default object.
  const [content, setContent] = useState(
    // JSON.parse(localStorage.getItem("dataLocal")) || 
    {
      header: {
        firstname:auth.resume.firstname,
        lastname:auth.resume.lastname,
        address:auth.resume.address,
        email:auth.resume.email,
        country:auth.resume.country,
        city:auth.resume.city,
        phone:auth.resume.phone,
      },
      professional: auth.resume.professional||{},
      education:auth.resume.education||{},
      additional: auth.resume.additional||[],
    }
  );

  const [contentFake, setContentFake] = useState();

  //Used to "Right" components know when to use the original state or the fake one (for the "example")
  const [control, setControl] = useState(false);

  function updateHeaderData(data) {
    setContent({ ...content, 
      header: data });
  }

  function updateProfessionalData(data) {
    setContent({ ...content, professional: data });
  }

  function updateEducationData(data) {
 
    setContent({ ...content, education: data });
  }

  function updateAdditionalData(data) {
    setContent({ ...content, additional: Object.values(data) }); //Converting the object to an Array in order to iterate in AdditionalSkillsP.js
  }

  function addFakeData() {
    setControl(true);
    setContentFake(fakeData);
  }

  function removeFakeData() {
    setControl(false);
    setContentFake({
      header: {},
      professional: { desc1: ["", "", ""], desc2: ["", "", ""] },
      education: {},
      additional: [],
    });
  }
  useEffect(() => {
    localStorage.setItem("dataLocal", JSON.stringify(content));
  }, [content]);

  return (
    <ResumeContext.Provider
      value={{
        content,
        control,
        contentFake,
        setContent,
        updateHeaderData,
        updateProfessionalData,
        updateEducationData,
        updateAdditionalData,
        addFakeData,
        removeFakeData,
      }}
    >
      {/* This refers to the children that this provider/components wraps. */}
      {props.children}
    </ResumeContext.Provider>
  );
};

export default ResumeContextProvider;
