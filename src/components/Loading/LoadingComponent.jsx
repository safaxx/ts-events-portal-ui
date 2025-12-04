import LoadingLogo from "./LoadingLogo";
import LoadingText from "./LoadingText";

const LoadingComponent = () => {
  return (
    <div className="loading-state">
      <LoadingLogo />
      <LoadingText />
    </div>
  );
};

export default LoadingComponent;