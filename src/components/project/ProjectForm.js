function ProjectForm(){
    return (
        <form>
            <div>
                <input type="text" placeholder="Insira o nome do projeto"></input>  
            </div>
            <div>
                <input type="number" placeholder="Insira o orçamento total"></input>  
            </div>
            <div>
                <select name="category_id">
                    <option disabled selected>Selecione a categoria</option>
                </select>
            </div>
            <div>
                <input type="submit" value="Criar Projeto"></input>
            </div>
        </form>
    )
}

export default ProjectForm