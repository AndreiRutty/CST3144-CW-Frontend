let app = new Vue({
  el: "#app",
  data: {
    displayCheckOut: false,
  },
  methods: {
    toggleCheckOut() {
      this.displayCheckOut = !this.displayCheckOut;
    },

    scrollToCourse() {
      const courseSection = document.getElementById("course-section");

      if (courseSection) {
        courseSection.scrollIntoView({ behavior: "smooth" });
      }
    },
  },
  computed: {},
});
