import { motion } from "framer-motion";

const WavingGirl = () => {
  // Animation configuration
  const popUpVariants = {
    hidden: {
      opacity: 0,
      scale: 0.5,
      y: 100,
    },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 260,
        damping: 20,
        duration: 0.6,
        delay: 0.7,
      },
    },
    hover: {
      scale: 1.05,
      transition: { type: "spring", stiffness: 400, damping: 10 },
    },
  };

  return (
    <div
      style={{
        display: "block",
        justifyContent: "center",
        alignItems: "center",
        height: "135vh",
        position: "fixed",
        zIndex: 4,
        marginLeft: "15rem",
        transform: "scale(0.7)",
        marginTop: "-2rem"
      }}
    >
      <motion.div
        variants={popUpVariants}
        initial="hidden"
        animate="visible"
        whileHover="hover"
        style={{ transformOrigin: "bottom" }} // Makes it pop UP from the floor
      >
        <img src="/waving-girl.svg" alt="Waving Girl" />
        
      </motion.div>
    </div>
  );
};

export default WavingGirl;
