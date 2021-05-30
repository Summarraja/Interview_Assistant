import React, { useContext } from "react";
import SearchBar from "material-ui-search-bar";
import "./ChatSearch.css"
import Grid from "@material-ui/core/Grid";
import { AuthContext } from "../../shared/context/auth-context";

function ChatSearch(props) {
  const auth = useContext(AuthContext);

  const getName = (chat) => {
    return (chat.from == auth.userId) ? chat.withName : chat.fromName
  }
  const cancelHandler=()=>{
    props.setSearchedData(null);
  }
  const searchHandler = (value) => {
    if (value == '')
      props.setSearchedData(null);
    else {
      let newData = props.data.filter(chat => getName(chat).toLowerCase().includes(value.toLowerCase()));
      props.setSearchedData(newData);
    }
  }
  return (
    <>
      <div className="search">
        <SearchBar
        onCancelSearch={cancelHandler}
          onChange={searchHandler}
          placeholder="Search Chat" style={{ height: "40px", width: "100%" }}
        />
      </div>
    </>
  );
}

export default ChatSearch;