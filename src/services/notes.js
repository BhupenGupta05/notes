import axios from "axios";
const baseURL = '/api/data'

let token = null

const setToken = (newToken) => {
    token = `Bearer ${newToken}`
}

const getAll = () => {
    const request = axios.get(baseURL)
    return request.then(response => response.data)
}

const create = async (newObj) => {
    const config = {
        headers: {Authorization: token},
    }
    const response = await axios.post(baseURL, newObj, config)
    return response.data
}

const update = (id,newObj) => {
    const request = axios.put(`${baseURL}/${id}`,newObj)
    return request.then(response => response.data)
}

export default {
    getAll,
    create,
    update,
    setToken
}