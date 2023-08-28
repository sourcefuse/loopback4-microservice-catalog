/* eslint-disable @typescript-eslint/no-misused-promises */
import { Box, TextField } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import { useState } from "react";
import { useChat } from "../../Hooks/useChat";
import Button from "../Button";

const textInputStyles = {
  wrapForm: {
    display: "flex",
    justifyContent: "center",
    width: "95%",
    margin: `auto`,
  },
  wrapText: {
    width: "100%",
  },
  button: {
    //margin: theme.spacing(1),
  },
};

export const TextInput = () => {
  const [inputValue, setInputValue] = useState("");
  const { handleSendMessage, loading: isSendingMessage } = useChat();

  const handleChat = async () => {
    await handleSendMessage(inputValue);
    setInputValue("");
  };

  const handleKeyDown = async (
    event: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (event.key === "Enter") {
      await handleChat();
    }
  };
  return (
    <>
      <Box sx={textInputStyles.wrapForm}>
        <TextField
          id="send-message"
          label="Message"
          variant="outlined"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          sx={textInputStyles.wrapText}
          disabled={isSendingMessage}
        />
        <Button
          disabled={isSendingMessage || inputValue === ""}
          variant="contained"
          color="primary"
          sx={textInputStyles.button}
          onClick={handleChat}
          isLoading={isSendingMessage}
        >
          <SendIcon />
        </Button>
      </Box>
    </>
  );
};
