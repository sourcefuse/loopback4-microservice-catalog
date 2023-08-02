import { Box, Typography } from "@mui/material";
import { styles } from "./styles";

export interface MessageRightProps {
  message: string;
  timestamp?: string;
}

export const MessageRight: React.FC<MessageRightProps> = ({
  message,
  timestamp,
}) => {
  return (
    <Box sx={styles.messageRowRight}>
      <Box sx={styles.messageOrange}>
        <Typography sx={styles.messageContent}>{message}</Typography>
        <Box sx={styles.messageTimeStampRight}>{timestamp}</Box>
      </Box>
    </Box>
  );
};
