import { useRef } from "react";
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
  const lastDragAt = useRef(0);
  const onDragEnd = ({ draggableId, source, destination }: DropResult) => {
    lastDragAt.current = Date.now();
    if (!destination || destination.droppableId === source.droppableId) return;
    const app = applications.find((item) => item.id === draggableId);
    const status = STATUSES.find((item) => item === destination.droppableId);
    if (app && status) onStatusChange(app, status);
  };

  return (
    <>
      <p className="board-help" id="board-help">
        Drag a card into another column. Click to edit it. With a keyboard,
        press Space, use arrow keys, then press Space to drop.
      </p>
      <DragDropContext
        onDragStart={() => {
          lastDragAt.current = Number.POSITIVE_INFINITY;
        }}
        onDragEnd={onDragEnd}
      >
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
                              {...drag.dragHandleProps}
                              style={drag.draggableProps.style}
                              aria-label={`${app.role} at ${app.company}, ${status}. Drag to change status or press Enter to edit.`}
                              title="Drag to move · Click to edit"
                              onClick={() => {
                                if (Date.now() - lastDragAt.current > 350)
                                  onEdit(app);
                              }}
                              onKeyDown={(event) => {
                                if (
                                  event.key === "Enter" &&
                                  !dragState.isDragging
                                ) {
                                  event.preventDefault();
                                  onEdit(app);
                                }
                              }}
                              className={`application-card${dragState.isDragging ? " application-card-dragging" : ""}`}
                            >
                              <div className="card-content">
                                <span
                                  className="company-icon"
                                  aria-hidden="true"
                                >
                                  {app.company.slice(0, 1).toUpperCase()}
                                </span>
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
                              </div>
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
