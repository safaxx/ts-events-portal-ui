import { motion } from "framer-motion";

const VSignGirl = () => {
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
        delay: 0.8,
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
        height: "105vh",
        position: "fixed",
        zIndex: 4,
        marginRight: "17rem"
      }}
    >
      <motion.div
        variants={popUpVariants}
        initial="hidden"
        animate="visible"
        whileHover="hover"
        style={{ transformOrigin: "bottom" }} // Makes it pop UP from the floor
      >
        <img src="/v-sign-girl.svg" alt="V-sign Girl" />
        
      </motion.div>
    </div>
  );
};

export default VSignGirl;
