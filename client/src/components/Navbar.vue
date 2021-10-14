<template>
  <div>
    <b-navbar toggleable="lg" type="dark" variant="info">
      <b-navbar-brand href="/">Mevn auth</b-navbar-brand>

      <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

      <b-collapse id="nav-collapse" is-nav>
        <b-navbar-nav>
          <b-nav-item to="/">Home</b-nav-item>
          <b-nav-item to="/about">About</b-nav-item>
        </b-navbar-nav>

        <!-- Right aligned nav items -->
        <b-navbar-nav class="ml-auto">
          <b-nav-item-dropdown right>
            <!-- Using 'button-content' slot -->
            <template #button-content>
              <em>User</em>
            </template>
            <b-dropdown-item to="/login" v-if="!isLoggedIn">
              Login
            </b-dropdown-item>
            <b-dropdown-item to="/register" v-if="!isLoggedIn">
              Register
            </b-dropdown-item>
            <b-dropdown-item to="/profile" v-if="isLoggedIn">
              Profile
            </b-dropdown-item>
            <b-dropdown-item to="/logout" v-if="isLoggedIn">
              Logout
            </b-dropdown-item>
          </b-nav-item-dropdown>
        </b-navbar-nav>
      </b-collapse>
    </b-navbar>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  name: "Navbar",
  computed: {
    ...mapGetters(["isLoggedIn"]),
  },
};
</script>
<style>
</style>