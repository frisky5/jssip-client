import { useState } from "react";
import "./jssip-client";
import { Box, Button, TextField } from "@mui/material";
import { setupJssip } from "./jssip-client";
function App() {
  const [sipUserId, setSipUserId] = useState("");

  return (
    <Box sx={{ width: "100vw", height: "100vh" }}>
      <TextField
        value={sipUserId}
        onChange={(e) => {
          setSipUserId(e.currentTarget.value);
        }}
        label="Enter SIP User ID"
        onKeyDown={(e) => {
          if (e.key === "Enter") setupJssip(sipUserId);
        }}
      />
      <Button
        onClick={() => {
          setupJssip(sipUserId);
        }}
      >
        call
      </Button>
      <audio id="call-audio" autoPlay={true} />
    </Box>
  );
}

export default App;
