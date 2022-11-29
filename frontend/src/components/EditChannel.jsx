import React, { useState } from "react";
import { useChatContext } from "stream-chat-react";
import { StreamChat } from "stream-chat";
import Cookies from "universal-cookie";

import { UserList } from "./";
import { CloseCreateChannel } from "../assets";

const ChannelNameInput = ({ channelName = "", setChannelName }) => {
  const handleChange = (event) => {
    event.preventDefault();
    setChannelName(event.target.value);
  };

  return (
    <div className="channel-name-input__wrapper">
      <p>Name</p>
      <input
        value={channelName}
        onChange={handleChange}
        placeholder="channel-name"
      />
      <p>Add Members</p>
    </div>
  );
};

const EditChannel = ({ setIsEditing }) => {
  const cookies = new Cookies();
  const apiKey = "zjnfd48mqkw3";

  const client = StreamChat.getInstance(apiKey);
  const { channel } = useChatContext();
  const [channelName, setChannelName] = useState(channel?.data?.name);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [created_by, setCreated_by] = useState(
    channel?.data?.created_by?.fullName
  );
  const currentUser = cookies.get("fullName");
  // Get Current User from Cookies
  const isSame = currentUser === created_by;

  console.log("isSame", isSame);

  const updateChannel = async (event) => {
    event.preventDefault();

    const nameChanged = channelName !== (channel.data.name || channel.data.id);

    if (nameChanged) {
      await channel.update(
        { name: channelName },
        { text: `Channel name changed to ${channelName}` }
      );
    }

    if (selectedUsers.length) {
      await channel.addMembers(selectedUsers);
    }
    // only update the Channel if the user is same as the one who created it
    if (channel?.data?.created_by?.id === client.userID) {
      await channel.update(
        { name: channelName },
        { text: `Channel name changed to ${channelName}` }
      );
    }

    setChannelName(null);
    setIsEditing(false);
    setSelectedUsers([]);
  };

  return (
    <div className="edit-channel__container">
      <div className="edit-channel__header">
        <p>Edit Channel</p>
        This Channel Is Created By: {created_by}
        <CloseCreateChannel setIsEditing={setIsEditing} />
      </div>
      <ChannelNameInput
        channelName={channelName}
        setChannelName={setChannelName}
      />
      <UserList setSelectedUsers={setSelectedUsers} />

      {isSame ? (
        <div className="edit-channel__button-wrapper" onClick={updateChannel}>
          <p>Save Changes</p>
        </div>
      ) : (
        <div className="">
          <p
            style={{
              color: "red",
              fontWeight: "bold",
              fontSize: "1.2rem",
              cursor: "not-allowed",
            }}
          >
            You can't Make Changes to this Group
          </p>
        </div>
      )}
    </div>
  );
};

export default EditChannel;
