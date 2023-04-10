import { useCallback, useContext, useEffect, useState } from "react";
import CardNote from "../../components/CardNote";
import FabButton from "../../components/FabButton";
import FormNote, { FormValueState } from "./FormNote";
import Modal from "../../components/Modal";
import { NotesService } from "../../services/notes/note-service";
import { Note } from "../../services/notes/types";
import { Container } from "./styles";
import { Context } from "../../Context/AuthContext";
import { useNavigate } from "react-router-dom";
import Loading from "../../components/Loading";

function Home() {
  const { handleLogout, authenticated } = useContext(Context);
  const [notes, setNotes] = useState<Note[]>([] as Note[]);
  const [showModal, setShowModal] = useState({ apresentar: false, titulo: 'Criar nota', funcaoSubmit: (parameter: any) => {} } );
  const [note, setNote] = useState<Note>({ id: 0, text: '', date: new Date , urgent: false});
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      const response = await NotesService.getNotes();

      setNotes(response.data);
      setLoading(false);
    })();
  }, []);

  const createNote = useCallback(
    (payload: FormValueState) => {
      (async () => {
        console.log(payload);
        const response = await NotesService.postNotes(payload);

        setNotes([...notes, response.data]);

        setShowModal({apresentar: false, titulo: 'Criar nota', funcaoSubmit: createNote});
      })();
    },
    [notes]
  );

  const deleteNote = useCallback((id: number) => {
    (async () => {
      await NotesService.deleteNote({ id });

      setNotes((prevState) => prevState.filter((note) => note.id !== id));
    })();
  }, []);

  const updateNote = (noteEdit: Note) => {
    console.log(noteEdit);
  };

  function editNoteButton(nota: Note){
    setNote(nota);
    setShowModal({ apresentar: true, titulo: 'Editar nota', funcaoSubmit: updateNote});
  }

  function createNoteButton(){
    setNote({ id: 0, text: '', date: new Date , urgent: false});
    setShowModal({ apresentar: true, titulo: 'Criar nota', funcaoSubmit: createNote});
  }

  useEffect(() => {
    if (!authenticated) navigate("/");
  }, [authenticated]);

  return (
    <>
      {loading && <Loading />}
      {showModal.apresentar && (
        <Modal
          title={ showModal.titulo }
          handleClose={() => setShowModal({ apresentar: false, titulo: 'Criar nota', funcaoSubmit: createNote})}
          style={{ width: "100px" }}
        >
          <FormNote handleSubmit={ showModal.funcaoSubmit } notaEdit={ note } />
        </Modal>
      )}
      <Container>
        {notes.map((note) => (
          <CardNote
            key={note.id}
            handleUpdate={editNoteButton}
            handleDelete={deleteNote}
            note={note}
          ></CardNote>
        ))}
        <FabButton position="left" handleClick={createNoteButton}>
          +
        </FabButton>
        <FabButton position="right" handleClick={handleLogout}>
          <span className="material-icons">logout</span>
        </FabButton>
      </Container>
    </>
  );
}

export default Home;
