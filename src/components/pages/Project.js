import styles from './Project.module.css'
import { useParams } from 'react-router-dom'
import { useState , useEffect} from 'react';

import Message from '../layout/message/Message'
import Loading from '../layout/loading/Loading'
import Container from '../layout/container/Container';
import ProjectForm from '../project/ProjectForm'
function Project(){
    const {id} = useParams()
    const [project, setProject] = useState([])
    const [showProjectForm, setShowProjectForm] = useState(false)
    const [message, setMessage] = useState()
    const [typeMessage, setTypeMessage] = useState()

    useEffect(() => {
        setTimeout(() => {
            fetch(`http://localhost:5000/projects/${id}`, {
                    method: "GET",
                    headers: {
                        'Content-Type': 'application/json'
                    },
                })
                .then((resp) => resp.json())
                .then((data) => {
                    setProject(data)
                })
                .catch((err) => console.log(err))
        }, 300)
    })

    function editPost(project){
        if(project.budget < project.cost) {
            setMessage('O custo do projeto não pode ser maior que o orçamento')
            setTypeMessage('error')
            return false
        }

        fetch(`http://localhost:5000/projects/${id}`, {
                    method: "PATCH",
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(project)
                })
                .then((resp) => resp.json())
                .then((data) => {
                    setProject(data)
                    setShowProjectForm(false)
                    setMessage('Projeto atualizado!')
                    setTypeMessage('success')
                })
                .catch((err) => console.log(err))
    }

    function toggleProjectForm() {
        setShowProjectForm(!showProjectForm)
    }

    return(
        <>
        {project.name ? (
            <div className={styles.project_details}>
                <Container customClass="column">
                    {message && <Message type={typeMessage} msg={message}></Message>}
                    <div className={styles.details_container}>
                        <h1>Projeto: {project.name}</h1>
                        <button className={styles.btn} onClick={toggleProjectForm}>
                            {!showProjectForm ? 'Editar projeto' : 'Fechar'}
                        </button>
                        {!showProjectForm ? (
                            <div className={styles.project_info}>
                                <p><span>Categoria:</span> {project.category.name}</p>
                                <p><span>Total de Orçamento:</span>R$ {project.budget}</p>
                                <p><span>Total utilizado:</span>R$ {project.cost}</p>
                            </div>
                        ):(
                            <div className={styles.project_info}> 
                                <ProjectForm handleSubmit={editPost} btnText="Concluir Edição" projectData={project}></ProjectForm>
                            </div>
                        )}
                    </div>
                </Container>
            </div>
        ):(
            <Loading></Loading>
        )}
        </>
    )
}

export default Project