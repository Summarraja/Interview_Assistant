import React from "react";
import './Message.css';

function Message(props) {
const MyID = "muqs"
    return (
        <>
                <div className={props.oneChatMsgSender === "Muqaddas"?"message sent" : "message received"}>
                    {props.oneChatMsgContent}
                    <div className="metadata">
                        <span className="date">05/20/2020</span>
                    </div>
                </div>
                {/* <div className="message sent">
                    {props.oneChatMsgContent}
                        <div className="metadata">
                        <span className="date">05/20/2020</span>
                    </div> */}
   

                {/* <div className="message received">
                    How are you ??
                        <div className="metadata">
                        <span className="date">05/20/2020</span>
                    </div>
                </div>
                <div className="message sent">
                    Fine
                        <div className="metadata">
                        <span className="date">05/20/2020</span>
                    </div>
                </div>

                <div className="message received">
                    what are you doing?
                        <div className="metadata">
                        <span className="date">05/20/2020</span>
                    </div>
                </div>
                <div className="message sent">
                    Nothing
                        <div className="metadata">
                        <span className="date">05/20/2020</span>
                    </div>
                </div>
                <div className="message received">
                    can you give me a bag with brown color?
                        <div className="metadata">
                        <span className="date">05/20/2020</span>
                    </div>
                </div>
                <div className="message sent">
                    Yes sure
                        <div className="metadata">
                        <span className="date">05/20/2020</span>
                    </div>
                </div>

                <div className="message received">
                    Lorem ipsum dolor sit amet consectetur, adipisicing elit. Consequatur voluptatibus fuga illo.
                        <div className="metadata">
                        <span className="date">05/20/2020</span>
                    </div>
                </div>
                <div className="message sent">
                    Lorem ipsum dolor, sit amet consectetur adipisicing.
                        <div className="metadata">
                        <span className="date">05/20/2020</span>
                    </div>
                </div>

                <div className="message received">
                    Lorem ipsum dolor sit amet consectetur, adipisicing elit. Consequatur voluptatibus fuga illo.
                        <div className="metadata">
                        <span className="date">05/20/2020</span>
                    </div>
                </div>
                <div className="message sent">
                    Lorem ipsum dolor, sit amet consectetur adipisicing.
                        <div className="metadata">
                        <span className="date">05/20/2020</span>
                    </div>
                </div>

                <div className="message received">
                    Lorem ipsum dolor sit amet consectetur, adipisicing elit. Consequatur voluptatibus fuga illo.
                        <div className="metadata">
                        <span className="date">05/20/2020</span>
                    </div>
                </div>
                <div className="message sent">
                    Lorem ipsum dolor, sit amet consectetur adipisicing.
                        <div className="metadata">
                        <span className="date">05/20/2020</span>
                    </div>
                </div> */}




        </>
    );
}

export default Message;