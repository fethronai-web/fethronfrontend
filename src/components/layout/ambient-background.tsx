export function AmbientBackground() {
  return (
    <div className="page-glow" aria-hidden="true">
      <div className="orb orb-red left-1/4 top-[-10%] h-[min(80vw,600px)] w-[min(80vw,600px)] -translate-x-1/2" />
      <div className="orb orb-swirl right-[-10%] top-[20%] h-[min(60vw,480px)] w-[min(60vw,480px)]" />
      <div className="orb orb-swirl bottom-[-15%] left-[-5%] h-[min(50vw,400px)] w-[min(50vw,400px)] opacity-60" />
    </div>
  );
}
