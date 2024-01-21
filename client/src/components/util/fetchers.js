
const api = async (method, url, data) => {
    try {
        let response = await fetch(url, {
            method,
            headers: {
                "Content-Type": "application/json",
            },
            body: data ? JSON.stringify(data) : undefined
        })
        if(response.status == 403 || response.status == 401){
            window.location.href = "./sign-in"
            localStorage.removeItem('persist:root')
            return {status: 'UnAuthorize',statusCode: response.status}
        }
        if(!response.ok)
        return { status: 'failed', data: error.message, statusCode: error.statusCode }

        response = await response.json();
        return { status: 'success', data: response };
        
    } catch (error) {
        return { status: 'failed', data: error.message, statusCode: error.statusCode }
    }
}

export default {
    get: (...args) => api('get', ...args),
    post: (...args) => api('post', ...args),
    put: (...args) => api('put', ...args),
    patch: (...args) => api('patch', ...args),
    delete: (...args) => api('delete', ...args),
}