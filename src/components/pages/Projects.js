import { useLocation } from 'react-router-dom'

import styles from './Projects.module.css'
import Message from "../layout/message/Message";
import Container from '../layout/container/Container'
import Loading from '../layout/loading/Loading'
import LinkButton from '../layout/linkbutton/LinkButton'
import { useState , useEffect} from 'react';
import ProjectCard from '../project/ProjectCard';

function Projects() {
    const [projects, setProjects] = useState([])
    const [removeLoading, setRemoveLoading] = useState(false)
    const [projectMessage, setProjectMessage] = useState('')
    const location = useLocation()
    let message = ''
    if (location.state){
        message = location.state.message
    }

    useEffect(() => {
        setTimeout(() => {
            fetch("http://localhost:5000/projects", {
                    method: "GET",
                    headers: {
                        'Content-Type': 'application/json'
                    },
                })
                .then((resp) => resp.json())
                .then((data) => {
                    console.log(data)
                    setProjects(data)
                    setRemoveLoading(true)
                })
                .catch((err) => console.log(err))
        }, 300)
    }, [])

    function removeProject(id) {
        fetch(`http://localhost:5000/projects/${id}`, {
                    method: "DELETE",
                    headers: {
                        'Content-Type': 'application/json'
                    },
                })
                .then((resp) => resp.json())
                .then(() => {
                    setProjects(projects.filter((project) => project.id !== id))
                    setProjectMessage('Projeto removido com sucesso!')
                })
                .catch((err) => console.log(err))
    }

    return(
        <div className={styles.project_container}>
            <div className={styles.title_container}>
                <h1>Meus Projetos</h1>
                <LinkButton to="/newproject" text="Criar Projeto"></LinkButton>
            </div>
            {message && <Message msg={message} type="success"></Message>}
            {projectMessage && <Message msg={projectMessage} type="success"></Message>}
            <Container customClass="start">
                {projects.length > 0 &&
                    projects.map((project) => 
                    <ProjectCard 
                    id={project.id}
                    name={project.name}
                    budget={project.budget}
                    category={project.category?.name}
                    key={project.id}
                    handleRemove={removeProject}
                    ></ProjectCard>
                    )
                }
                {!removeLoading && <Loading></Loading>}
                {removeLoading && projects.length === 0 && (
                    <p>Não há projetos cadastrados!</p>
                )}
            </Container>
        </div>
    )
}
export default Projects