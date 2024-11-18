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
    url: "http://localhost:3000",
  },
  methods: {
    fetchCourses() {
      fetch(`${this.url}/courses`)
        .then((res) => {
          if (!res.ok) throw new Error("Couldn't retrieve the courses");

          return res.json();
        })
        .then((data) => {
          this.courses = data;
          this.courses.forEach((course) => {
            if (course.numberOfSeat == undefined) {
              course.numberOfSeat = 0;
            }
          });
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
      // Checking the item is already in the shopping cart
      const exisitngItem = this.findItemInCart(item._id);

      if (exisitngItem) {
        // Checking if number of seat is less than item available space number
        if (exisitngItem.numberOfSeat < item.spaces) {
          exisitngItem.numberOfSeat += 1;
          alert(`${item.subject} course added to cart`);
        } else {
          alert("No more space is available");
        }
      } else {
        if (item.spaces > 0) {
          item.numberOfSeat = 1;
          this.cart.push(item);
          alert(`${item.subject} course added to cart`);
        } else {
          alert("No more space is available");
        }
      }

      item.spaces--;
    },

    removeItem(item) {
      // Reinitialize number of seat
      item.numberOfSeat = 0;

      // Removing course from cart
      this.cart = this.cart.filter((cartItem) => cartItem._id != item._id);

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

          // // Updating the number of spaces for each courses bought
          fetch(`${this.url}/courses/${course._id}`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              subject: course.subject,
              location: course.location,
              price: course.price,
              spaces: course.spaces,
              img: course.img,
            }),
          })
            .then((res) => res.json())
            .catch((err) => console.log(err));

          this.cart = this.cart.filter(
            (cartItem) => cartItem._id != course._id
          );
        });

        const order = {
          name: this.name,
          phoneNumber: this.phoneNumber,
          lessonIDs: lessonIDs,
          numberOfSpace: numberOfSeatsInfo,
        };

        // Adding new order to the database
        fetch(`${this.url}/order`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(order),
        })
          .then((data) => console.log(data))
          .catch((err) => console.log(err));

        // Clearing Input Field
        this.name = "";
        this.phoneNumber = "";

        alert("Order Placed\nThanks for Your Purchase");
      }
    },
    imgUrl(filename) {
      return `${this.url}/courses/images/${filename.toLowerCase()}.png`;
    },
    async searchCourses() {
      try {
        if (this.search != "") {
          const res = await fetch(
            `${this.url}/search?q=${encodeURIComponent(this.search)}`
          );
          const data = await res.json();

          this.courses = data;
        } else {
          this.fetchCourses(); // Fetch all courses if search is empty
        }
      } catch (err) {
        console.log(`Error ${err}`);
      }
    },
  },
  computed: {
    cartItemCount() {
      return this.cart.length || "";
    },
  },
  mounted() {
    this.fetchCourses();
  },
});
