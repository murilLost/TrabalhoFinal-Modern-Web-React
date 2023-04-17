import { SearchStyled } from "./styles";

interface SearchProps {

    value: string,
    handleSearch: (e: any) => void;
}

    function Search({value, handleSearch}: SearchProps ) {
        return(
            <SearchStyled
                value={value}
                type="search"  
                onChange={handleSearch}
                placeholder="Pesquise sua Nota">
            </SearchStyled>

        )
        
    }

    export default Search;