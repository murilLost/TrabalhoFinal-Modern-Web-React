import { Note } from "../../services/notes/types";
import { formatDate } from "../../services/utils";
import { Container } from "./styles";

interface NoteProps {
  note: Note;
  handleDelete: (id: number) => void;
  handleUpdate: (noteEdit: Note) => void;
}

function CardNote({ note, handleDelete, handleUpdate }: NoteProps) {
  return (
    <>
      <Container>
        <p>{formatDate(new Date(note?.date))}</p>
        <p>{note.text}</p>
        <span className="material-icons edit" onClick={() => handleUpdate(note)}>edit</span>
        {note.urgent && (
          <span className="material-icons" id="priority">
            priority_high
          </span>
        )}
        <span className="material-icons delete" onClick={() => handleDelete(note.id)}>
          {" "}
          delete_forever{" "}
        </span>
      </Container>
    </>
  );
}

export default CardNote;
