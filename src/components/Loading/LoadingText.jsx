import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const ShimmerWithDots = ({
  text1 = "Activating Sabr mode",
  text2 = "Loading soon Insha Allah",
}) => {
  const [currentText, setCurrentText] = useState(text1);

  useEffect(() => {
    const intervalId = setInterval(() => {
      // Logic to toggle between text1 and text2
      setCurrentText((prevText) => {
        return prevText === text1 ? text2 : text1;
      });
    }, 2000); // Change text every 1000ms (1 second)

    // CLEANUP FUNCTION: This is crucial!
    // It clears the interval when the component unmounts
    // or before the effect runs again, preventing memory leaks.
    return () => {
      clearInterval(intervalId);
    };
  }, [text1, text2]);

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        padding: "16px",
        borderRadius: "8px",
        width: "fit-content",
        marginTop: "-4rem",
      }}
    >
      {/* Shimmer Text */}
      <div
        style={{
          position: "relative",
          overflow: "hidden",
          display: "inline-block",
          marginRight: "4px",
        }}
      >
        <span
          style={{
            color: "#154481ff",
            //fontWeight: "500",
            fontSize: "20px",
          }}
        >
          {currentText}
        </span>

        {/* Shimmer Overlay */}
        <motion.div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background:
              "linear-gradient(90deg, transparent, rgba(255,255,255,0.8), transparent)",
            pointerEvents: "none",
          }}
          animate={{ x: ["-100%", "200%"] }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "linear",
            repeatDelay: 0.5,
          }}
        />
      </div>

      {/* Animated Dots */}
      <div style={{ display: "flex", gap: "2px" }}>
        {[0, 0.2, 0.4].map((delay, index) => (
          <motion.span
            key={index}
            animate={{ opacity: [0, 1, 0] }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              delay: delay,
              ease: "easeInOut",
            }}
            style={{
              color: "#154481ff",
              fontSize: "20px",
              lineHeight: "1",
              marginTop: "0.7rem",
            }}
          >
            •
          </motion.span>
        ))}
      </div>
    </div>
  );
};

export default ShimmerWithDots;
