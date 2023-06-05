"use strict";
// global selectors
let steps = document.querySelectorAll(".side-bar .steps-list li");
let pages = document.querySelectorAll(".form-container .page");
let nextBtn = document.querySelector(".form-container #next-btn");
let backBtn = document.querySelector(".form-container #back-btn");
let Btns = document.querySelector(".btns");
//get selectors of the first form
let inputs = Array.from(document.querySelectorAll(".info-page input"));
let nameInput = document.querySelector("form #name");
let errNameMsg = document.querySelector("form .name-err");
let emailInput = document.querySelector("form #email");
let errEmailMsg = document.querySelector("form .email-err");
let phoneInput = document.querySelector("form #phone");
let errPhoneMsg = document.querySelector("form .phone-err");
//get selectors of the second form
let plans = Array.from(document.querySelectorAll(".plan-page .plan"));
let priceToggle = document.querySelector(".plan-page .btn button");
//get selectors of the third form
let addOns = Array.from(document.querySelectorAll(".add-ons-page .box"));

let changeBtn = document.querySelector(".summary-page .change-plan");
let totalPrice = document.querySelector(".summary-page .total span");

let currentPage = 0;
let currentStep = 0;
let selectedPlan = {};
let selectedAdds = {};
let data = [];

backBtn.style.opacity = "0";

selectPlan();

selectAdd();

// add event listeners
nextBtn.addEventListener("click", (e) => {
  if (validateInputs()) {
    if (currentPage >= 0) {
      backBtn.style.opacity = "1";
    }
    switch (currentPage) {
      case 1:
        if (!plans.some((plan) => plan.classList.contains("selected"))) {
          alert("Please select a plan");
          return;
        }
        break;
      case 2:
        if (!addOns.some((add) => add.classList.contains("checked"))) {
          alert("Please select an add-on");
          return;
        }
        break;
    }

    if (currentPage === 2) {
      let changeBtn = document.querySelector(".summary-page .change-plan");

      changeBtn.addEventListener("click", (e) => {
        moveToNextPage(currentPage - 2);
        currentPage = 1;
      });

      let planPrice = document.querySelector(
        ".summary-page .plan .price span"
      ).textContent;
      let total = document.querySelector(".summary-page .total span");
      let addOnsPriceArr = [];
      let selectedAddOns = document.querySelectorAll(".summary-page .add-ons");
      selectedAddOns.forEach((add) => {
        addOnsPriceArr.push(add.querySelector(".price span").textContent);
      });
      let addOnsTotal = addOnsPriceArr.reduce((a, b) => {
        return Number(a) + Number(b);
      });

      let billing = document.querySelector(".summary-page .price-label span");
      billing.textContent =
        document.querySelector(".summary-page .plan h3 span").textContent ===
        "(monthly)"
          ? "per month"
          : "per year";
      total.textContent = `${parseInt(addOnsTotal) + parseInt(planPrice)}`;
      nextBtn.textContent = "Confirm";
      nextBtn.style.background = "hsl(243, 100%, 62%)";
    } else {
      nextBtn.textContent = "Next Step";
      nextBtn.style.background = "hsl(213, 96%, 18%)";
    }
    if (currentPage >= 3) {
      Btns.style.display = "none";
    }
    if (currentStep >= 3) {
      currentStep = 2;
    }
    moveToNextPage(currentPage + 1);
    moveToNextStep(currentStep + 1);
    currentPage++;
    currentStep++;
  }
});

backBtn.addEventListener("click", (e) => {
  if (currentPage <= 1) {
    backBtn.style.opacity = "0";
  }
  if (currentPage > 0) {
    moveToNextPage((currentPage -= 1));
  }
  if (currentStep > 0) {
    moveToNextStep((currentStep -= 1));
  }
});

//functions
function moveToNextPage(indexPage) {
  pages.forEach((page) => {
    page.style.display = "none";
  });
  pages[indexPage].style.display = "block";
}

function moveToNextStep(stepIndex) {
  steps.forEach((step) => {
    step.classList.remove("active");
  });
  steps[stepIndex].classList.add("active");
}

//new valid inputs function
function validateInputs() {
  let namePattern = /^[a-zA-Z]+\s[a-zA-Z]+$/;
  let emailPattern = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  let phonePattern = /^\+1\s?[0-9]{3}\s?[0-9]{3}\s?[0-9]{3}$/;

  let isFormValid = true;

  function validateInput(input, pattern, errorMsg) {
    if (input.value === "") {
      input.classList.add("not-valid");
      errorMsg.textContent = "This field is required";
      isFormValid = false;
    } else if (pattern.test(input.value) === false) {
      input.classList.add("not-valid");
      errorMsg.textContent = "Invalid input";
      isFormValid = false;
    } else {
      input.classList.remove("not-valid");
      input.classList.add("valid");
      errorMsg.textContent = "";
    }
  }

  validateInput(nameInput, namePattern, errNameMsg);
  validateInput(emailInput, emailPattern, errEmailMsg);
  validateInput(phoneInput, phonePattern, errPhoneMsg);

  return isFormValid;
}

function selectPlan() {
  plans.forEach((plan) => {
    plan.addEventListener("click", (e) => {
      plans.forEach((plan) => {
        plan.classList.remove("selected");
      });
      plan.classList.add("selected");
      selectedPlan = {
        name: document.querySelector(".selected .plan-name").textContent,
        price: parseInt(
          document.querySelector(".selected .price span").textContent
        ),
        billing: e.currentTarget.classList.contains("yearly")
          ? "yearly"
          : "monthly",
      };
      showSelectedPlan();
    });
  });
  priceToggle.addEventListener("click", (e) => {
    if (e.currentTarget.parentNode.classList.contains("monthly")) {
      e.currentTarget.parentNode.classList.remove("monthly");
      e.currentTarget.parentNode.classList.add("yearly");
      plans.forEach((plan) => {
        plan.classList.add("yearly");
        plan.querySelector(".price span").textContent *= 10;
      });
      if (selectedPlan) {
        selectedPlan.price *= 10;
        selectedPlan.billing = "yearly";
      }
    } else {
      e.currentTarget.parentNode.classList.remove("yearly");
      e.currentTarget.parentNode.classList.add("monthly");
      plans.forEach((plan) => {
        plan.classList.remove("yearly");
        plan.querySelector(".price span").textContent /= 10;
      });
      if (selectedPlan) {
        selectedPlan.price /= 10;
        selectedPlan.billing = "monthly";
      }
    }
    showSelectedPlan();
  });
}

function selectAdd() {
  let addArr = [];
  addOns.forEach((add) => {
    add.addEventListener("click", (e) => {
      let addId = `add${add.dataset.id}`;
      let addName = add.querySelector(".add-on-name").textContent;
      let addPrice = add.querySelector(".price span").textContent;
      if (e.currentTarget.classList.contains("checked")) {
        e.currentTarget.classList.remove("checked");
        deleteObjectById(addId, addArr);
      } else {
        e.currentTarget.classList.add("checked");
        addArr.push({ id: addId, name: addName, price: addPrice });
      }
      showSelectedAdd(addArr);
    });
  });
}

function deleteObjectById(id, arr) {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i].id === id) {
      arr.splice(i, 1);
      break;
    }
  }
}

function showSelectedPlan() {
  let planContent = document.querySelector(".summary-page .plan-content");
  let planName = document.createElement("h3");
  let planPrice = document.createElement("div");

  planPrice.className = "price";

  let myPlan = selectedPlan;
  planContent.textContent = "";

  planName.innerHTML = `${myPlan.name}<span>(${myPlan.billing})</span>`;
  planPrice.innerHTML = `$<span>${myPlan.price}</span>/mo`;

  planContent.appendChild(planName);
  planContent.appendChild(planPrice);
}

function showSelectedAdd(dataArr) {
  let addOnsContainer = document.querySelector(
    ".summary-page .selected-add-ons"
  );
  addOnsContainer.textContent = "";

  if (dataArr !== "") {
    dataArr.forEach((add) => {
      let addOn = document.createElement("div");
      addOn.className = "add-ons";
      let addName = document.createElement("span");
      addName.className = "add-on-name";
      addName.textContent = add.name;

      let addPrice = document.createElement("div");
      addPrice.className = "price";
      addPrice.innerHTML = `+$<span>${add.price}</span>/mo`;

      addOn.appendChild(addName);
      addOn.appendChild(addPrice);

      addOnsContainer.appendChild(addOn);
    });
  }
}
