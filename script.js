let app = new Vue({
  el: "#app",
  data: {
    displayCheckOut: false,
    searchFilter: "Subject",
    courses: [],
    cart: [],
    search: "",
    name: "",
    phoneNumber: "",
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
      return this.cart.find((item) => item._id == id);
    },

    addToCart(item) {
      // Define the number of seat property is not already
      if (item.numberOfSeat == undefined) {
        item.numberOfSeat = 0;
      }

      if (item.spaces > 0) {
        if (this.findItemInCart(item._id)) {
          item.numberOfSeat += 1;
        } else {
          item.numberOfSeat = 1;
          this.cart.push(item);
        }
        alert(`${item.subject} course added to cart`);
        item.spaces -= 1;
      }
    },
    removeItem(item) {
      // Reinitialize number of seat
      item.numberOfSeat = 0;

      // Removing course from cart
      this.cart = this.cart.filter((cartItem) => cartItem._id != item._id);

      item.spaces += 1;
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
    placeOrder() {
      const lessonIDs = [];
      const numberOfSeatsInfo = [];

      if (!this.cartItemCount) {
        alert("No Items Bought");
      } else {
        this.cart.forEach((course) => {
          // Collecting the lessons Id for the order object
          lessonIDs.push(course._id);

          numberOfSeatsInfo.push({
            courseId: course._id,
            numberOfSeat: course.numberOfSeat,
          });

          // Updating the number of spaces for each courses bought
          let updatedSpaceCount = course.spaces - course.numberOfSeat;
          fetch(`http://localhost:3000/courses/${course._id}`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ spaces: updatedSpaceCount }),
          })
            .then((res) => res.json())
            .catch((err) => console.log(err));

          this.removeItem(course);
        });

        const order = {
          name: this.name,
          phoneNumber: this.phoneNumber,
          lessonIDs: lessonIDs,
          numberOfSpace: numberOfSeatsInfo,
        };

        // console.log(order);

        // Adding new order to the database
        fetch("http://localhost:3000/order", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(order),
        })
          .then((res) => res.json())
          .catch((err) => console.log(err));

        // Clearing Input Field
        this.name = "";
        this.phoneNumber = "";
      }
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
