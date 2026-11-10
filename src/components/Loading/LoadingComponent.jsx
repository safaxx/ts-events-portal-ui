import LoadingLogo from "./LoadingLogo";
import LoadingText from "./LoadingText";

const LoadingComponent = () => {
  return (
    <div className="flex min-h-[400px] flex-col items-center justify-center gap-5">
      <LoadingLogo />
      <LoadingText />
    </div>
  );
};

export default LoadingComponent;