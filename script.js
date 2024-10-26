let app = new Vue({
  el: "#app",
  data: {
    displayCheckOut: false,
    searchFilter: "Subject",
    courses: [],
    cart: [],
    search: "",
  },
  methods: {
    fetchCourses() {
      fetch("http://localhost:3000/courses")
        .then((res) => {
          if (!res.ok) throw new Error("Couldn't retrieve the courses");

          return res.json();
        })
        .then((data) => {
          this.courses = data;
        })
        .catch((err) => {
          console.log(`Error: ${err}`);
        });
    },
    toggleCheckOut() {
      this.displayCheckOut = !this.displayCheckOut;
    },

    scrollToCourse() {
      const courseSection = document.getElementById("course-section");

      if (courseSection) {
        courseSection.scrollIntoView({ behavior: "smooth" });
      }
    },

    findItemInCart(id) {
      return this.cart.find((item) => item.id == id);
    },

    addToCart(item) {
      if (!this.findItemInCart(item.id) && item.spaces > 0) {
        this.cart.push(item);
        item.spaces--;
        alert(`${item.subject} course added to cart`);
      } else {
        alert("You already have added this course to your cart");
      }
    },
    removeItem(item) {
      this.cart = this.cart.filter((cartItem) => cartItem.id != item.id);
      item.spaces++;
    },
    sortCourses() {
      this.courses.sort((a, b) => {
        if (this.searchFilter == "price" || this.searchFilter == "spaces") {
          return a[this.searchFilter] - b[this.searchFilter];
        } else {
          return a[this.searchFilter].localeCompare(b[this.searchFilter]);
        }
      });
    },
    sortDescending() {
      this.courses.sort((a, b) => {
        if (this.searchFilter == "price" || this.searchFilter == "spaces") {
          return b[this.searchFilter] - a[this.searchFilter];
        } else {
          return b[this.searchFilter].localeCompare(a[this.searchFilter]);
        }
      });
    },
  },
  computed: {
    cartItemCount() {
      return this.cart.length || "";
    },

    filteredCourses() {
      return this.courses.filter(
        (course) =>
          course.subject.toLowerCase().includes(this.search.toLowerCase()) ||
          course.location.toLowerCase().includes(this.search.toLowerCase())
      );
    },
  },
  mounted() {
    this.fetchCourses();
  },
});
