import React from "react";
import SearchBar from "material-ui-search-bar";
import "./ChatSearch.css"
import Grid from "@material-ui/core/Grid";

 function ChatSearch() {
 
  return (
    <>
    <div className="search">

 <SearchBar 
    placeholder="Search Chat" style={{height:"40px", width:"100%"}}
  />
  </div>
  </>
  );
}

export default ChatSearch;