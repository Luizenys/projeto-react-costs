import { useLocation } from 'react-router-dom'

import styles from './Projects.module.css'
import Message from "../layout/message/Message";
import Container from '../layout/container/Container'
import LinkButton from '../layout/linkbutton/LinkButton'

function Projects() {
    const location = useLocation()
    let message = ''
    if (location.state){
        message = location.state.message
    }
    return(
        <div className={styles.project_container}>
            <div className={styles.title_container}>
                <h1>Meus Projetos</h1>
                <LinkButton to="/newproject" text="Criar Projeto"></LinkButton>
            </div>
            {message && <Message msg={message} type="success"></Message>}
            <Container customClass="start">
                <p>Projetos...</p>
            </Container>
        </div>
    )
}
export default Projects