let app = new Vue({
  el: "#app",
  data: {
    displayCheckOut: false,
    searchFilter: "Subject",
    courses: [
      {
        id: 1,
        subject: "Math",
        location: "Room 1",
        price: 100,
        spaces: 5,
      },
      {
        id: 2,
        subject: "English",
        location: "Room 2",
        price: 90,
        spaces: 5,
      },
      {
        id: 3,
        subject: "Science",
        location: "Room 3",
        price: 110,
        spaces: 5,
      },
      {
        id: 4,
        subject: "History",
        location: "Room 4",
        price: 95,
        spaces: 5,
      },
      {
        id: 5,
        subject: "Geography",
        location: "Room 5",
        price: 85,
        spaces: 5,
      },
      {
        id: 6,
        subject: "Art",
        location: "Room 6",
        price: 120,
        spaces: 5,
      },
      {
        id: 7,
        subject: "Music",
        location: "Room 7",
        price: 130,
        spaces: 5,
      },
      {
        id: 8,
        subject: "Physical Education",
        location: "Gym",
        price: 80,
        spaces: 5,
      },
      {
        id: 9,
        subject: "Computer Science",
        location: "Lab 1",
        price: 140,
        spaces: 3,
      },
      {
        id: 10,
        subject: "Biology",
        location: "Room 8",
        price: 115,
        spaces: 2,
      },
    ],
    cart: [],
    search: "",
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
});
