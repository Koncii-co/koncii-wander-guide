
import GlitteryBackground from "@/components/GlitteryBackground";

const IndexBackground = () => {
  return (
    <>
      {/* Glittery Background */}
      <GlitteryBackground />

      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-1">
        <div className="absolute -top-1/2 -right-1/2 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-1/2 -left-1/2 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
      </div>
    </>
  );
};

export default IndexBackground;
