import {
  DragDropContext,
  Draggable,
  Droppable,
  type DropResult,
} from "@hello-pangea/dnd";
import {
  currentRound,
  effectiveStatus,
  STATUSES,
  type Application,
  type Status,
} from "./domain";

const dateLabel = (date: string) =>
  new Date(`${date}T12:00:00`).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

export function ApplicationsBoard({
  applications,
  today,
  busy,
  onEdit,
  onStatusChange,
}: {
  applications: Application[];
  today: string;
  busy: string | null;
  onEdit: (application: Application) => void;
  onStatusChange: (application: Application, status: Status) => void;
}) {
  const onDragEnd = ({ draggableId, source, destination }: DropResult) => {
    if (!destination || destination.droppableId === source.droppableId) return;
    const app = applications.find((item) => item.id === draggableId);
    const status = STATUSES.find((item) => item === destination.droppableId);
    if (app && status) onStatusChange(app, status);
  };

  return (
    <>
      <p className="board-help" id="board-help">
        Drag a card by its handle into another column. Use Space and arrow keys
        to move it with a keyboard.
      </p>
      <DragDropContext onDragEnd={onDragEnd}>
        <div
          className="board"
          aria-label="Applications board"
          aria-describedby="board-help"
        >
          {STATUSES.map((status) => {
            const cards = applications.filter(
              (app) => effectiveStatus(app, today) === status,
            );
            return (
              <Droppable droppableId={status} key={status}>
                {(provided, snapshot) => (
                  <section
                    className={`column column-${status.toLowerCase()}${snapshot.isDraggingOver ? " column-drop-target" : ""}`}
                    aria-label={`${status}, ${cards.length} applications`}
                  >
                    <div className="column-heading">
                      <div>
                        <span className="status-mark" />
                        <h2>{status}</h2>
                      </div>
                      <span className="column-count">{cards.length}</span>
                    </div>
                    <div
                      className="column-body"
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                    >
                      {cards.map((app, index) => (
                        <Draggable
                          draggableId={app.id}
                          index={index}
                          key={app.id}
                          isDragDisabled={busy === app.id}
                        >
                          {(drag, dragState) => (
                            <article
                              ref={drag.innerRef}
                              {...drag.draggableProps}
                              style={drag.draggableProps.style}
                              className={`application-card${dragState.isDragging ? " application-card-dragging" : ""}`}
                            >
                              <div className="card-top">
                                <span
                                  className="company-icon"
                                  aria-hidden="true"
                                >
                                  {app.company.slice(0, 1).toUpperCase()}
                                </span>
                                <span
                                  className="drag-handle"
                                  {...drag.dragHandleProps}
                                  aria-label={`Drag ${app.role} at ${app.company} to another column`}
                                  title="Drag to change status"
                                >
                                  <svg
                                    aria-hidden="true"
                                    viewBox="0 0 20 20"
                                    fill="currentColor"
                                  >
                                    <circle cx="6" cy="4" r="1.5" />
                                    <circle cx="14" cy="4" r="1.5" />
                                    <circle cx="6" cy="10" r="1.5" />
                                    <circle cx="14" cy="10" r="1.5" />
                                    <circle cx="6" cy="16" r="1.5" />
                                    <circle cx="14" cy="16" r="1.5" />
                                  </svg>
                                </span>
                              </div>
                              <button
                                className="card-open"
                                onClick={() => onEdit(app)}
                                aria-label={`Edit ${app.role} at ${app.company}`}
                              >
                                <strong>{app.company}</strong>
                                <span className="role">{app.role}</span>
                                <span className="card-detail">
                                  Applied {dateLabel(app.applicationDate)}
                                </span>
                                {status === "Interview" && (
                                  <span className="card-detail accent">
                                    {currentRound(app.rounds)?.name ||
                                      "No upcoming round"}
                                  </span>
                                )}
                                {status === "Ghosted" &&
                                  app.status === "Applied" && (
                                    <span className="auto-tag">
                                      Auto-ghosted · 45 days
                                    </span>
                                  )}
                                {status !== "Interview" &&
                                  app.rounds.length > 0 && (
                                    <span className="card-detail">
                                      {app.rounds.length} interview{" "}
                                      {app.rounds.length === 1
                                        ? "round"
                                        : "rounds"}{" "}
                                      saved
                                    </span>
                                  )}
                              </button>
                            </article>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                      {cards.length === 0 && !snapshot.isDraggingOver && (
                        <p className="column-empty">
                          No applications here yet.
                        </p>
                      )}
                    </div>
                  </section>
                )}
              </Droppable>
            );
          })}
        </div>
      </DragDropContext>
    </>
  );
}
