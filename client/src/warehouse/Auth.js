/* import axios from 'axios';
import router from '../router' */

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

}

const mutations = {

}

export default {
    state,
    getters,
    actions,
    mutations
}