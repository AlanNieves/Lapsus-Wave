import { cn } from "@/lib/utils"; 

const FriendsActivity = () => {
  // Misiones actualizadas con mejor UX
  const missions = [
    {
      title: "🔥 DJ de Emergencia",
      progress: 1,
      target: 5,
      reward: "Emblema Dorado + Shuffle Premium",
      description: "Crea playlists para situaciones absurdas",
      special: true
    },
    {
      title: "🕵️ Detective de Letras",
      progress: 3,
      target: 5,
      reward: "Insignia Sherlock Musical"
    },
    {
      title: "🌍 Turista Sonoro",
      progress: 2,
      target: 3,
      reward: "Pasaporte Nivel 2"
    }
  ];

  return (
    <div className="rounded-lg bg-gradient-to-b from-lapsus-1200/35 to-lapsus-1200/25 p-4">
      <h3 className="text-sm font-semibold text-lapsus-300 mb-4">Misiones Activas</h3>
      
      <div className="space-y-4">
        {missions.map((mission, index) => (
          <div 
            key={index}
            className={cn(
              "p-4 rounded-md transition-colors group",
              mission.special 
                ? "bg-gradient-to-r from-amber-900/40 to-lapsus-1000/40 border border-amber-800/50"
                : "bg-lapsus-1000/40 hover:bg-lapsus-1000/60"
            )}
          >
            <div className="flex flex-col gap-3">
              {/* Encabezado de misión especial */}
              {mission.special && (
                <div className="flex items-center gap-2 text-amber-400 text-xs font-medium mb-2">
                  <span>🌟 MISIÓN ESTRELLA</span>
                </div>
              )}
              
              {/* Contenido principal */}
              <div className="flex justify-between items-start">
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-medium text-lapsus-200 truncate">
                    {mission.title}
                  </h4>
                  {mission.description && (
                    <p className="text-xs text-lapsus-500 mt-1 truncate">
                      {mission.description}
                    </p>
                  )}
                </div>
                <span className="text-sm text-lapsus-500 pl-2">
                  {mission.progress}/{mission.target}
                </span>
              </div>
              
              {/* Barra de progreso */}
              <div className="h-2 bg-zinc-800 rounded-full overflow-hidden mt-2">
                <div 
                  className="h-full bg-lapsus-500 transition-all duration-300"
                  style={{ width: `${(mission.progress / mission.target) * 100}%` }}
                />
              </div>
              
              {/* Recompensa */}
              <div className="flex justify-between items-center text-xs mt-2">
                <span className="text-lapsus-400">Recompensa:</span>
                <span className={cn(
                  "text-lapsus-300 font-medium truncate",
                  mission.special && "text-amber-300"
                )}>
                  {mission.reward}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FriendsActivity;