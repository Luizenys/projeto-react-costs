import {parse, v4 as uuidv4} from 'uuid'

import styles from './Project.module.css'
import { useParams } from 'react-router-dom'
import { useState , useEffect} from 'react';

import Message from '../layout/message/Message'
import Loading from '../layout/loading/Loading'
import Container from '../layout/container/Container';
import ProjectForm from '../project/ProjectForm'
import ServiceForm from '../service/ServiceForm'
import ServiceCard from '../service/ServiceCard'

function Project(){
    const {id} = useParams()
    const [project, setProject] = useState([])
    const [services, setServices] = useState([])
    const [showProjectForm, setShowProjectForm] = useState(false)
    const [showServiceForm, setShowServiceForm] = useState(false)
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
                    setServices(data.services)
                })
                .catch((err) => console.log(err))
        }, 300)
    })

    function editPost(project){
        setMessage('')

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

    function toggleServiceForm() {
        setShowServiceForm(!showServiceForm)
    }

    function createService(){
        setMessage('')
        const lastService = project.services[project.services.length - 1]

        lastService.id = uuidv4()

        const lastServiceCost = lastService.cost

        const newCost = parseFloat(project.cost) + parseFloat(lastServiceCost)
        if (newCost > parseFloat(project.budget)){
            setMessage('Orçamento ultrapassado, verifique o valor do serviço')
            setTypeMessage('error')
            project.services.pop()
            return false
        }

        project.cost = newCost

        fetch(`http://localhost:5000/projects/${id}`, {
                    method: "PATCH",
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(project)
                })
                .then((resp) => resp.json())
                .then((data) => {
                    setShowServiceForm(false)
                })
                .catch((err) => console.log(err))
    }

    function removeService(id, cost){
        const servicesUpdated = project.services.filter(
            (service) => service.id !== id
        )

        const projectUpdated = project
        projectUpdated.services = servicesUpdated
        projectUpdated.cost = parseFloat(projectUpdated.cost) - cost

        fetch(`http://localhost:5000/projects/${projectUpdated.id}`, {
                    method: "PATCH",
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(projectUpdated)
                })
                .then((resp) => resp.json())
                .then((data) => {
                    setProject(projectUpdated)
                    setServices(servicesUpdated)
                    setMessage('Serviço removido com sucesso!')
                    setTypeMessage('success')
                })
                .catch((err) => console.log(err))
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
                    <div className={styles.service_form_container}>
                        <h2>Adicione um serviço:</h2>
                        <button className={styles.btn} onClick={toggleServiceForm}>
                            {!showServiceForm ? 'Adicionar serviço' : 'Fechar'}
                        </button>
                        <div className={styles.project_info}>
                            {showServiceForm && (
                                <ServiceForm handleSubmit={createService} btnText="Adicionar Serviço" projectData={project}/>
                            )}
                        </div>
                    </div>
                    <h2>Serviços</h2>
                    <Container customClass="start">
                        {services.length > 0 && 
                            services.map((service) => (
                                <ServiceCard
                                id={service.id}
                                name={service.name}
                                cost={service.cost}
                                description={service.description}
                                key={service.id}
                                handleRemove={removeService}
                                >
                                </ServiceCard>
                            ))
                        }
                        {services.length === 0 && <p>Não há serviços cadastrados.</p>}
                    </Container>
                </Container>
            </div>
        ):(
            <Loading></Loading>
        )}
        </>
    )
}

export default Project