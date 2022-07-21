const Hero = ({ children, text }) => {
  return (
    <div className="hero md:min-h-screen bg-base-200">
      <div className="hero-content flex-col-reverse md:flex-row-reverse flex-1">
        {children}
        <div className="flex-1">{text}</div>
      </div>
    </div>
  );
};

export default Hero;
