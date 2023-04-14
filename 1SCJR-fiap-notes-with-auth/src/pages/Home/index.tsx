import { ChangeEvent, useCallback, useContext, useEffect, useState } from "react";
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
  const options = ["all", "urgent", "not-urgent"]
  const { handleLogout, authenticated } = useContext(Context);
  const [notes, setNotes] = useState<Note[]>([] as Note[]);
  const [showModal, setShowModal] = useState({ apresentar: false, titulo: 'Criar nota', funcaoSubmit: (parameter: any) => {} } );
  const [note, setNote] = useState<Note>({ id: 0, text: '', date: new Date , urgent: false});
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(options[0]);

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

  const updateNote = useCallback(
    (payload: Note) => {
      (async () => {

        const response = await NotesService.putNote(payload);
        if(response.status == 200){

          setNotes(notas => 
            notas.map(nota => {
              if(nota.id === payload.id) {
                return {...nota, text: payload.text, urgent: payload.urgent};
              }
              return nota;
            }));

        }
        
        setShowModal({apresentar: false, titulo: 'Criar nota', funcaoSubmit: createNote});
      })();
    },
    [notes]
  );

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

  const submit = () => {
    console.log(selected);
  };

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
        <select 
          value={selected} 
          onChange={(e) => setSelected(e.target.value)}>
          {options.map((value) => (
            <option value={value} key={value}>
              {value}
            </option>
          ))}
        </select>
      <input 
          type="search" 
          value={search} 
          onChange={(e)=> setSearch(e.target.value)}
      />
        {notes.filter(note => {
          if (search === ''){
            return note;
          }else if(note.text.toLowerCase().includes(search.toLowerCase())){
            return note;
          }
          if(note.urgent == true && selected === options[1]){
            console.log(note, "urgente")
            return note;
          } else if(note.urgent == false && selected === options[2]){
            console.log(note, "não urgente")

            return note;
          }else{
            console.log(note, "all")

            return note;
          }
        }) 
        .map((note) => (
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
