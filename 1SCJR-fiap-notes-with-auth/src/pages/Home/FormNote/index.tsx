import React, {
  ChangeEvent,
  FormEvent,
  FormEventHandler,
  useCallback,
  useState,
} from "react";
import Button from "../../../components/Button";
import Checkbox from "../../../components/Checkbox";
import { Form } from "./styles";
import { Note } from "../../../services/notes/types";

export interface FormValueState {
  id?: number;
  text: string;
  urgent: boolean;
}

interface FormNoteProps {
  notaEdit: Note;
  handleSubmit: (payload: FormValueState) => void;
}

function FormNote({ handleSubmit, notaEdit }: FormNoteProps) {
  const [formValues, setFormValues] = useState<FormValueState>({
    id: notaEdit.id,
    text: notaEdit.text,
    urgent: notaEdit.urgent as boolean,
  });

  const handleChangeUrgent = useCallback(() => {
    setFormValues((prevState) => ({ ...prevState, urgent: !prevState.urgent }));
  }, [setFormValues]);

  const handleInput = (event: ChangeEvent<HTMLTextAreaElement>) =>
    setFormValues({ ...formValues, text: event.target.value });

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    handleSubmit(formValues);
  };

  return (
    <Form onSubmit={onSubmit}>
      <textarea
        value={formValues.text}
        onChange={handleInput}
        autoFocus
        placeholder="Insira o texto da nota"
      />
      <Checkbox
        checked={formValues.urgent}
        handleChange={handleChangeUrgent}
        label="Urgente?"
      />
      <Button handleClick={() => {}}>Salvar</Button>
    </Form>
  );
}

export default FormNote;
