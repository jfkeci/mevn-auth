import Messages from "../components/Messages.vue";

export default {
    data() {
        return {
            messages: []
        }
    },
    components: {
        Messages
    },
    methods: {
        setMessage(type, text) {
            this.messages = [];
            this.messages.push({
                type: type,
                text: text,
            });
        },
    }
}