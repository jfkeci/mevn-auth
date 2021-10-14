<template>
  <div>
    <b-card class="mt-3" header="Login">
      <b-form @submit="onSubmit" class="mt-3">
        <b-form-group id="input-group-1" label="Your Name:" label-for="input-1">
          <b-form-input
            id="input-1"
            v-model="form.name"
            type="text"
            placeholder="Name"
            required
          ></b-form-input>
        </b-form-group>

        <b-form-group
          id="input-group-2"
          label="Your Username:"
          label-for="input-2"
        >
          <b-form-input
            id="input-2"
            v-model="form.username"
            type="text"
            placeholder="Username"
            required
          ></b-form-input>
        </b-form-group>

        <b-form-group
          id="input-group-3"
          label="Your Email:"
          label-for="input-3"
        >
          <b-form-input
            id="input-3"
            v-model="form.email"
            type="email"
            placeholder="Email"
            required
          ></b-form-input>
        </b-form-group>

        <b-form-group
          id="input-group-4"
          label="Your Password"
          label-for="input-4"
        >
          <b-form-input
            id="input-4"
            v-model="form.password"
            placeholder="Password"
            type="password"
            required
          ></b-form-input>
        </b-form-group>

        <b-form-group
          id="input-group-5"
          label="Confirm password"
          label-for="input-5"
        >
          <b-form-input
            id="input-5"
            v-model="form.confirm_password"
            placeholder="Confirm password"
            type="password"
            required
          ></b-form-input>
        </b-form-group>

        <hr />

        <Messages :messages="messages" />

        <b-button type="submit" class="mt-3" variant="primary">Login</b-button>
        &nbsp;&nbsp;&nbsp;
        <router-link to="/login">Already have an accout?</router-link>
      </b-form>
    </b-card>
    <b-card class="mt-3" header="Form">
      <pre class="m-0">{{ form }}</pre>
    </b-card>
  </div>
</template>

<script>
import Messages from "../components/Messages.vue";

export default {
  name: "Login",
  data() {
    return {
      form: {
        name: "",
        username: "",
        email: "",
        password: "",
        confirm_password: "",
      },
      messages: [],
    };
  },
  components: {
    Messages,
  },
  methods: {
    onSubmit() {},
  },
};
</script>

<style scoped>
</style>