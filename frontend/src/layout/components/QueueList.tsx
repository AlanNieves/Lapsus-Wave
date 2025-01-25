import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { usePlayerStore } from "@/stores/usePlayerStore";
import { useRef } from "react";
import { X } from "lucide-react";

const QueueList = ({ onClose }: { onClose: () => void }) => {
  const { queue, currentSong, setQueue } = usePlayerStore();
  const listRef = useRef<HTMLDivElement>(null);
  
  const handleDragEnd = (result: any) => {
    if (!result.destination) return;
    
    const newQueue = Array.from(queue);
    const [movedSong] = newQueue.splice(result.source.index, 1);
    newQueue.splice(result.destination.index, 0, movedSong);
    
    setQueue(newQueue);
  };

  return (
    <div 
      ref={listRef}
      className="fixed w-80 bg-lapsus-1000/90 backdrop-blur rounded-lg p-4 shadow-xl z-50"
      style={{ top: "50%", left: "50%", transform: "translate(-50%, -50%)" }}
    >
      <button 
        onClick={onClose}
        className="absolute top-2 right-2 p-1 rounded-full hover:bg-lapsus-1100/40"
      >
        <X className="h-5 w-5 text-lapsus-500" />
      </button>

      <h3 className="text-lg font-bold mb-4">Queue</h3>
      
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="songs">
          {(provided) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="space-y-2"
            >
              {queue.map((song, index) => (
                <Draggable key={song._id} draggableId={song._id} index={index}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      className={`p-2 rounded-md flex items-center justify-between ${
                        song._id === currentSong?._id 
                          ? "bg-lapsus-1200/50" 
                          : "hover:bg-lapsus-1100/40"
                      } transition-all`}
                      style={{
                        ...provided.draggableProps.style,
                        boxShadow: snapshot.isDragging 
                          ? "0 4px 6px rgba(0, 0, 0, 0.1)" 
                          : "none",
                      }}
                    >
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <div {...provided.dragHandleProps}>
                          <span className="text-lapsus-500">⠿</span>
                        </div>
                        <img
                          src={song.imageUrl}
                          alt={song.title}
                          className="w-10 h-10 rounded flex-shrink-0"
                        />
                        <div className="min-w-0">
                          <p className="font-medium truncate">{song.title}</p>
                          <p className="text-sm text-lapsus-500 truncate">
                            {song.artist}
                          </p>
                        </div>
                      </div>
                  
                      {/* Indicador de reproducción */}
                      {song._id === currentSong?._id && (
                        <div className="flex gap-1">
                          <div className="w-0.5 h-4 bg-lapsus-500 animate-bounce"></div>
                          <div className="w-0.5 h-4 bg-lapsus-500 animate-bounce delay-100"></div>
                          <div className="w-0.5 h-4 bg-lapsus-500 animate-bounce delay-200"></div>
                        </div>

                      )}
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
};

export default QueueList;