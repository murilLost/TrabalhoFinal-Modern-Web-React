import { useCallback, useContext, useEffect, useState } from "react";
import CardNote from "../../components/CardNote";
import FabButton from "../../components/FabButton";
import FormNote, { FormValueState } from "./FormNote";
import Modal from "../../components/Modal";
import { NotesService } from "../../services/notes/note-service";
import { Note } from "../../services/notes/types";
import { Container, Header } from "./styles";
import { Context } from "../../Context/AuthContext";
import { useNavigate } from "react-router-dom";
import Loading from "../../components/Loading";
import Select from "../../components/Select";
import Search from "../../components/Search";

function Home() {
  const options = ["Todas", "Urgente", "Não Urgente"]
  const { handleLogout, authenticated } = useContext(Context);
  const [notes, setNotes] = useState<Note[]>([] as Note[]);
  const [showModal, setShowModal] = useState({ apresentar: false, titulo: 'Criar nota', funcaoSubmit: (parameter: any) => { } });
  const [note, setNote] = useState<Note>({ id: 0, text: '', date: new Date, urgent: false });
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

        setShowModal({ apresentar: false, titulo: 'Criar nota', funcaoSubmit: createNote });
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
        if (response.status == 200) {

          setNotes(notas =>
            notas.map(nota => {
              if (nota.id === payload.id) {
                return { ...nota, text: payload.text, urgent: payload.urgent };
              }
              return nota;
            }));

        }

        setShowModal({ apresentar: false, titulo: 'Criar nota', funcaoSubmit: createNote });
      })();
    },
    [notes]
  );

  function editNoteButton(nota: Note): void {
    setNote(nota);
    setShowModal({ apresentar: true, titulo: 'Editar nota', funcaoSubmit: updateNote });
  }

  function createNoteButton(): void {
    setNote({ id: 0, text: '', date: new Date, urgent: false });
    setShowModal({ apresentar: true, titulo: 'Criar nota', funcaoSubmit: createNote });
  }

  function validaOpcaoSelecionada(nota: Note): boolean {
    if (selected === options[0] ||
      nota.urgent == true && selected === options[1] ||
      nota.urgent == false && selected === options[2]) {

      return true;
    }

    return false;
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
          title={showModal.titulo}
          handleClose={() => setShowModal({ apresentar: false, titulo: 'Criar nota', funcaoSubmit: createNote })}
          style={{ width: "100px" }}
        >
          <FormNote handleSubmit={showModal.funcaoSubmit} notaEdit={note} />
        </Modal>
      )}
      <Container>
        <Header>
          <FabButton position="left" handleClick={createNoteButton}>
            +
          </FabButton>
          <Select
            value={selected}
            handleChange={(e: any) => setSelected(e.target.value)}
            options={options}
          />
          <Search
            value={search}
            handleSearch={(e: any) => setSearch(e.target.value)}
          />
          <FabButton position="right" handleClick={handleLogout}>
            <span className="material-icons">logout</span>
          </FabButton>
        </Header>
        {notes.filter(note => {
          if (search === '') {
            if (validaOpcaoSelecionada(note)) {

              return note;
            }
          } else if (note.text.toLowerCase().includes(search.toLowerCase())) {
            if (validaOpcaoSelecionada(note)) {

              return note;
            }
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

      </Container>
    </>
  );
}

export default Home;
