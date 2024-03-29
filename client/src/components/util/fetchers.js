
const api = async (method, url, data) => {
    try {
        let response = await fetch(url, {
            method,
            headers: {
                "Content-Type": "application/json",
            },
            body: data ? JSON.stringify(data) : undefined
        })

        let responseData = await response.json();

        if (!response.ok)
            return { status: 'failed', data: responseData.message, statusCode: responseData.statusCode }

        return { status: 'success', data: responseData, statusCode: response.status };

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