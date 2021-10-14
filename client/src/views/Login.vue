<template>
  <div>
    <b-card
      class="mt-3"
      header="Login"
      border-variant="primary"
      header-bg-variant="primary"
      header-text-variant="white"
    >
      <b-form @submit.prevent="onSubmit" class="mt-3">
        <b-form-group
          id="input-group-1"
          label="Your Email or Username:"
          label-for="input-1"
        >
          <b-form-input
            id="input-1"
            v-model="input"
            type="text"
            placeholder="Email or Username"
            required
          ></b-form-input>
        </b-form-group>

        <b-form-group
          id="input-group-2"
          label="Your Password"
          label-for="input-2"
        >
          <b-form-input
            id="input-2"
            v-model="user.password"
            placeholder="Password"
            type="password"
            required
          ></b-form-input>
        </b-form-group>

        <hr />
        <Messages :messages="messages" />

        <input type="submit" class="btn btn-primary mt-3" value="Login" />
        &nbsp;&nbsp;&nbsp;
        <router-link to="/register">Need an account?</router-link>
      </b-form>
    </b-card>
  </div>
</template>

<script>
import messagesMixin from "../mixins/messagesMixin";
import { mapActions } from "vuex";
export default {
  name: "Login",
  mixins: [messagesMixin],
  data() {
    return {
      input: "",
      user: { password: "" },
    };
  },
  methods: {
    ...mapActions(["login"]),
    onSubmit() {
      this.setUserObject();
      this.login(this.user)
        .then((res) => {
          console.log(res);
          if (res.data.success) {
            this.$router.push({ name: "Profile" });
          } else {
            this.setMessage("danger", res.data.message);
          }
        })
        .catch((err) => {
          console.log(err);
          this.setMessage("danger", "Something went wrong");
        });
    },
    setUserObject() {
      this.user = { password: this.user.password };
      if (this.input.includes("@")) {
        this.user["email"] = this.input;
      } else {
        this.user["username"] = this.input;
      }
    },
  },
};
</script>

<style scoped>
</style>