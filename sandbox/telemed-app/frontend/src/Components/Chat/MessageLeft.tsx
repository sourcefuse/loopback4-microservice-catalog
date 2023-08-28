import { Avatar, Box, Typography } from "@mui/material";
import { styles } from "./styles";

export interface MessageLeftProps {
  message: string;
  timestamp?: string;
  userName: string;
}

export const MessageLeft: React.FC<MessageLeftProps> = ({
  message,
  userName,
  timestamp,
}) => {
  const time = timestamp ? timestamp : "";
  return (
    <>
      <Box sx={styles.messageRow}>
        <Avatar alt={userName} sx={styles.orange}>
          {userName.charAt(0)}
        </Avatar>
        <Box>
          <Box sx={styles.userName}>{userName}</Box>
          <Box sx={styles.messageBlue}>
            <Box>
              <Typography sx={styles.messageContent}>{message}</Typography>
            </Box>
            <Box sx={styles.messageTimeStampRight}>{time}</Box>
          </Box>
        </Box>
      </Box>
    </>
  );
};
