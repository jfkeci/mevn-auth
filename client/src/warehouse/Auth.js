import axios from 'axios';
/* import router from '../router' */

// Basic initial state of the application
const state = {
    token: localStorage.getItem('token') || '',
    user: {},
    status: ''
}

const getters = {
    /* isLoggedIn: (state) => {
        if (state.token != '') {
            return true
        } else {
            return false
        }
    } */
    isLoggedIn: state => !!state.token,
    authState: state => state.status,
    user: state => state.user
}

const actions = {
    //Login action
    async login({ commit }, user) {
        commit('auth_request');
        let res = await axios.post('http://localhost:5000/api/user/login', user)
        if (res.data.success) {
            const token = res.data.token
            const user = res.data.user

            // Store the token
            localStorage.setItem('token', token)

            // Set the axios defaults

            axios.defaults.headers.common['Authorization'] = token;
            commit('auth_success', token, user)
        }
        return res
    }
}

const mutations = {
    auth_request(state) {
        state.status = 'loading'
    },
    auth_success(state, token, user) {
        state.token = token
        state.user = user
        state.status = 'success'
    }
}

export default {
    state,
    getters,
    actions,
    mutations
}