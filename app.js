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
let planPrice = document.querySelector(".plan-page .plan .price");
let priceToggle = document.querySelector(".plan-page .btn button");
let monthly = document.querySelector(".plan-page .monthly");
let yearlyLabel = document.querySelector(".plan-page .yearly");
//get selectors of the third form
let addOns = Array.from(document.querySelectorAll(".add-ons-page .box"));

let totalPrice = document.querySelector(".summary-page .total span");

let currentPage = 0;
let currentStep = 0;

backBtn.style.opacity = "0";

selectPlan();

selectAdd();

// add event listeners
nextBtn.addEventListener("click", (e) => {
  if (
    validNameInput(nameInput) &&
    validEmailInput(emailInput) &&
    validPhoneInput(phoneInput)
  ) {
    if (currentPage >= 0) {
      backBtn.style.opacity = "1";
    }
    if (currentPage === 1) {
      let hasSelected = plans.some((plan) => {
        return plan.classList.contains("selected");
      });
      if (!hasSelected) {
        alert("Please select a plan");
        return;
      }
    }
    if (currentPage === 2) {
      let hasSelected = addOns.some((add) => {
        return add.classList.contains("checked");
      });
      if (!hasSelected) {
        alert("Please select an add-on");
        return;
      }
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

function validNameInput(nameInput) {
  let isValid = false;

  let pattern = /^[a-zA-Z]+\s[a-zA-Z]+$/;
  if (nameInput.value === "") {
    nameInput.classList.add("not-valid");
    errNameMsg.textContent = "This field is required";
    isValid = false;
  } else if (pattern.test(nameInput.value) === false) {
    nameInput.classList.add("not-valid");
    errNameMsg.textContent = "Must be a valid name";
    isValid = false;
  } else {
    errNameMsg.textContent = "";
    nameInput.classList.remove("not-valid");
    nameInput.classList.add("valid");
    isValid = true;
  }
  return isValid;
}

function validEmailInput(emailInput) {
  let pattern = /[a-zA-Z0-9._%+-]+@[a-z]+\.[a-z]{2,}/;
  let isValid = false;

  if (emailInput.value === "") {
    emailInput.classList.add("not-valid");
    errEmailMsg.textContent = "This field is required";
    isValid = false;
  } else if (pattern.test(emailInput.value) === false) {
    emailInput.classList.add("not-valid");
    errEmailMsg.textContent = "Must be a valid email";
    isValid = false;
  } else {
    errEmailMsg.textContent = "";
    emailInput.classList.remove("not-valid");
    emailInput.classList.add("valid");
    isValid = true;
  }
  return isValid;
}

function validPhoneInput(phoneInput) {
  let pattern = /^\+1\s?[0-9]{3}\s?[0-9]{3}\s?[0-9]{3}$/;
  let isValid = false;

  if (phoneInput.value === "") {
    phoneInput.classList.add("not-valid");
    errPhoneMsg.textContent = "This field is required";
    isValid = false;
  } else if (pattern.test(phoneInput.value) === false) {
    phoneInput.classList.add("not-valid");
    errPhoneMsg.textContent = "Must be a valid phone";
    isValid = false;
  } else {
    errPhoneMsg.textContent = "";
    phoneInput.classList.remove("not-valid");
    phoneInput.classList.add("valid");
    isValid = true;
  }
  return isValid;
}

function selectPlan() {
  plans.forEach((plan) => {
    plan.addEventListener("click", (e) => {
      plans.forEach((plan) => {
        plan.classList.remove("selected");
      });
      plan.classList.add("selected");
      const selectedPlan = {};
      selectedPlan.name = document.querySelector(
        ".selected .plan-name"
      ).textContent;
      selectedPlan.price = parseInt(
        document.querySelector(".selected .price span").textContent
      );
      selectedPlan.billing = e.currentTarget.classList.contains("yearly")
        ? "yearly"
        : "monthly";

      sessionStorage.setItem("plan", JSON.stringify(selectedPlan));

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
      if (sessionStorage.getItem("plan")) {
        let data = JSON.parse(sessionStorage.getItem("plan"));
        data.name = data.name;
        data.price = data.price * 10;
        data.billing = "yearly";
        let newData = JSON.stringify(data);
        sessionStorage.setItem("plan", newData);
      }
    } else {
      e.currentTarget.parentNode.classList.remove("yearly");
      e.currentTarget.parentNode.classList.add("monthly");
      plans.forEach((plan) => {
        plan.classList.remove("yearly");
        plan.querySelector(".price span").textContent /= 10;
      });
      if (sessionStorage.getItem("plan")) {
        let data = JSON.parse(sessionStorage.getItem("plan"));
        data.name = data.name;
        data.price = data.price / 10;
        data.billing = "monthly";
        let newData = JSON.stringify(data);
        sessionStorage.setItem("plan", newData);
      }
    }
  });
}

let selectedAdds = {};
let addArr = [];
function selectAdd() {
  addOns.forEach((add) => {
    add.addEventListener("click", (e) => {
      let addId = `add${add.dataset.id}`;
      let addName = add.querySelector(".add-on-name").textContent;
      let addPrice = add.querySelector(".price span").textContent;

      if (e.currentTarget.classList.contains("checked")) {
        e.currentTarget.classList.remove("checked");

        delete addArr[selectedAdds[addId]];
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

  let myPlan = JSON.parse(sessionStorage.getItem("plan"));
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
