import { SelectStyled } from "./styles";



interface SelectProps {
    value: string,
    handleChange: (e: any) => void,
    options: string[];

}

function Select({ value, handleChange, options }: SelectProps) {

    return (
        <SelectStyled
            value={value}
            onChange={handleChange}
        >

            {options.map((value) => (
                <option value={value} key={value}>
                    {value}
                </option>
            ))}
        </SelectStyled>
    );
}

export default Select; 