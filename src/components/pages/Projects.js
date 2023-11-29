import { useLocation } from 'react-router-dom'

import styles from './Projects.module.css'
import Message from "../layout/message/Message";
import Container from '../layout/container/Container'
import LinkButton from '../layout/linkbutton/LinkButton'
import { useState , useEffect} from 'react';
import ProjectCard from '../project/ProjectCard';

function Projects() {
    const [projects, setProjects] = useState([])
    const location = useLocation()
    let message = ''
    if (location.state){
        message = location.state.message
    }

    useEffect(() => {
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
            })
            .catch((err) => console.log(err))
    }, [])

    return(
        <div className={styles.project_container}>
            <div className={styles.title_container}>
                <h1>Meus Projetos</h1>
                <LinkButton to="/newproject" text="Criar Projeto"></LinkButton>
            </div>
            {message && <Message msg={message} type="success"></Message>}
            <Container customClass="start">
                {projects.length > 0 &&
                    projects.map((project) => 
                    <ProjectCard 
                    id={project.id}
                    name={project.name}
                    budget={project.budget}
                    category={project.category?.name}
                    key={project.id}
                    ></ProjectCard>
                    )
                }
            </Container>
        </div>
    )
}
export default Projects