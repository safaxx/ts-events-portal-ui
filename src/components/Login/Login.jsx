import {
  Box,
  Button,
  Container,
  CssBaseline,
  TextField,
  Typography,
} from "@mui/material";
import { motion } from "framer-motion";
import { useState } from "react";
import OtpInput from "react-otp-input";
import "./Login.css";

function Login() {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle login logic here
    console.log("Email:", email);
    console.log("otp:", otp);
  };

  // Define the style for each input box for OTP
  const inputStyle = {
    width: "3rem",
    height: "3rem",
    fontSize: "1.5rem",
    textAlign: "center",
    border: "1px solid #ccc",
    borderRadius: "4px",
    margin: "0 4px", // Replaces the separator
  };

  return (
    <motion.div
      className="login-container"
      initial={{ opacity: 0, y: -50 }} // Starts transparent and 50px above
      animate={{ opacity: 1, y: 0 }} // Animates to full opacity at its original position
      transition={{ duration: 0.5 }} // Animation takes 0.5 seconds
    >
      <Container component="main" maxWidth="xs" className="login-form">
        <CssBaseline />
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>

          <Typography component="label" variant="body2" color="textSecondary">
            Enter your registered Tech Sisters email
          </Typography>

          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{ mt: 1 }}
          >
            <TextField
              margin="normal"
              required
              fullWidth
              type="email"
              id="email"
              label="Email"
              name="email"
              autoComplete="email"
              autoFocus
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              sx={{ mb: 3 }}
            />

            {/* --- Start of OTP Input --- */}
            <div className="form-group mt-3">
              <Typography
                component="label"
                variant="body2"
              >
                Enter the 6-digit OTP sent to your email
              </Typography>

              <OtpInput
                value={otp}
                onChange={setOtp}
                numInputs={6}
                isInputNum={true}
                shouldAutoFocus={true}
                // This is the new required prop
                renderInput={(props, index) => (
                  <input
                    {...props}
                    style={inputStyle} // Apply your custom styles here
                  />
                )}
              />
            </div>
            {/* --- End of OTP Input --- */}

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign In
            </Button>
          </Box>
        </Box>
      </Container>
    </motion.div>
  );
}

export default Login;
