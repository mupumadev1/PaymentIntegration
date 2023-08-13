const sortCodeDiv = document.getElementById("sortCodeDiv");
const sortCodeInput = document.getElementById("sortcode");
const accountname = document.getElementById('accountname')
const bankNameSelect = document.getElementById('bankNameSelect')
const branchDescSelect = document.getElementById('branchDesc');
const branchNameDv = document.getElementById('branchNameSelectDiv')
const submitBtn = document.getElementById('submit')
const accInput = document.getElementById('account_no')
const vendorSearch = document.getElementById('vendor-search')
const vendorSearchButton = document.getElementById('search-button')
let groupedData = {};
const selectedBank = []

service_IDs = {
    'ATLASMARA': 347,
    'AB BANK': 329,
    'ACCESS BANK': 332,
    'ABSA': 377,
    'BANK OF CHINA': 317,
    'FIRST CAPITAL BANK': 314,
    'CITIBANK': 368,
    'ECOBANK': 320,
    'FIRST ALLIANCE BANK': 326,
    'FIRST NATIONAL BANK': 383,
    'INDO ZAMBIA BANK': 371,
    'INVESTRUST': 380,
    'STANDARD CHARTERED': 362,
    'STANBIC': 374,
    'UNITED BANK FOR AFRICA': 323,
    'ZANACO': 359,
    'ZNBS': 356
}

loadBankList();
accInput.addEventListener('blur', (ev) => {
    const bankN = selectedBank[0];
    console.log(bankN)
    if (bankN === 'ZICB') {
        fetch(`verify_account/zicb/?account_no=${ev.target.value}`)
            .then(response => response.json())
            .then(data => {
                let accountName;
                if (data.response === false) {
                    submitBtn.setAttribute('disabled', 'disabled')
                    accountname.value = ''
                    branchDescSelect.innerHTML = ''
                    sortCodeInput.value = ''

                } else {
                    accountName = data.response[0].accountTitle
                    console.log(accountName)
                    accountname.value = accountName
                    accountname.readOnly = true
                    branchDescSelect.innerHTML = ''
                    const option = document.createElement('option');
                    option.value = data.response[0].branchname
                    option.textContent = data.response[0].branchname
                    branchDescSelect.appendChild(option);
                    sortCodeInput.value = data.response[0].brnCode
                    submitBtn.removeAttribute('disabled')


                }
            })
    } else {
        const service_id = service_IDs[bankN]
        submitBtn.removeAttribute('disabled')

        /*fetch(`verify_account/other/?account_no=${ev.target.value}&service_id=${service_id}`)
            .then(response => response.json())
            .then(data => {
                if (data.response === false) {
                    submitBtn.setAttribute('disabled', 'disabled')

                } else {

                    submitBtn.removeAttribute('disabled')
                }
            })*/

    }
})
bankNameSelect.addEventListener('change', (ev) => {
    const bankName = ev.target.value
    addBankServiceID(bankName.toUpperCase())
    if (bankName === 'ZICB') {
        branchNameDv.classList.remove('d-none')
        sortCodeDiv.classList.remove('d-none')
        branchDescSelect.innerHTML = ''
        const option = document.createElement('option');
        option.value = 'ZICB'
        option.textContent = 'ZICB'
        option.selected = true
        branchDescSelect.appendChild(option);
        sortCodeInput.value = '101';
        sortCodeInput.readOnly = true
    } else {
        branchNameDv.classList.remove('d-none')
        sortCodeInput.value = ''
        branchDescSelect.innerHTML = "<option></option>"
        const bankEntries = groupedData[bankName]
        for (const entry of bankEntries) {
            const branchDesc = entry.branchDesc;
            const option = document.createElement('option');
            option.value = branchDesc;
            option.textContent = branchDesc;
            branchDescSelect.appendChild(option);
        }
        branchDescSelect.addEventListener('change', (ev) => {
            sortCodeDiv.classList.remove('d-none')
            const branchDesc = ev.target.value
            sortCodeInput.value = getSortCode(bankName, branchDesc);
            sortCodeInput.readOnly = true

        })
    }
})

vendorSearchButton.addEventListener('click', () => {
    let vendorID = vendorSearch.value
    fetch(`bank_details/search?vendor=${vendorID}`)
        .then(response => response.text())
        .then(html => {
            const parser = new DOMParser();
            const newDoc = parser.parseFromString(html, 'text/html');
            const newTable = newDoc.getElementById('table-body');
            console.log(newTable)
            const tableBody = document.getElementById('table-body');
            tableBody.replaceWith(newTable);
        })
})

function loadBankList() {
    fetch('loadBanks')
        .then(response => response.json())
        .then(data => {
                // Group the data by bank
                data.forEach(entry => {
                    const bankName = entry.bankName;
                    if (!groupedData[bankName]) {
                        groupedData[bankName] = [];
                    }
                    groupedData[bankName].push(entry);

                });
                for (const bankName in groupedData) {
                    const option = document.createElement('option');
                    option.value = bankName;
                    option.textContent = bankName;
                    bankNameSelect.appendChild(option);
                }
            }
        )
        .catch(error => {
            console.error(error);
        });
}

function addBankServiceID(bank) {
    if (selectedBank === []) {
        selectedBank.push(bank)
    } else {
        selectedBank[0] = bank
    }
}


function getSortCode(bankName, branchDesc) {
    // Iterate over the grouped data to find the matching bank name and branch description
    const bankEntries = groupedData[bankName]
    for (const entry of bankEntries) {

        if (entry.branchDesc === branchDesc) {
            return entry.sortCode; // Return the sort code of the matched entry
        }
    }
    return ''; // Return an empty string if no matching entry is found
}


/*detailsForm.addEventListener('submit', function(event) {
  event.preventDefault(); // Prevent default form submission

  // Collect form data
  const formData = new FormData(detailsForm);

  // Send an HTTP POST request to the Django backend
  fetch('/bank_details/upload/', {
    method: 'POST',
    body: formData
  })
  .then(response => response.json())
  .then(data => {
    // Handle the response from the backend
    console.log(data);
    // Perform any necessary actions based on the response
  })
  .catch(error => {
    // Handle any errors that occurred during the request
    console.error(error);
  });
});


let sortC = document.getElementById('sortcode').value
const sortCodeInput = document.getElementById('sortcode')
sortCodeInput.addEventListener('input', handleInputChange);
sortCodeInput.addEventListener('keydown', handleKeyDown);
sortCodeInput.addEventListener('blur', handleBlur);

function handleInputChange(event) {
    const currentValue = event.target.value;
    if (currentValue !== sortC) {
        // Value has changed
        sortC = currentValue;
        searchBySortCode(currentValue);
    }
}

function handleKeyDown(event) {
    if (event.key === 'Enter') {
        // Enter key pressed, handle the change
        const currentValue = event.target.value;
        if (currentValue !== sortC) {
            sortC = currentValue;
            searchBySortCode(currentValue);
        }
    }
}

function handleBlur(event) {
    // Handle change when the input loses focus
    const currentValue = event.target.value;
    if (currentValue !== sortC) {
        sortC = currentValue;
        searchBySortCode(currentValue);
    }
}

function createChainedDropdown() {


}

function searchBySortCode(sortC) {

    branchNameDiv.innerHTML = "";
    bankNameDiv.innerHTML = "";
    // Iterate over each bank in the grouped data
    for (const bankName in groupedData) {
        const bankEntries = groupedData[bankName];

        // Iterate over each entry in the bank
        for (const entry of bankEntries) {
            if (entry.sortCode === sortC) {
                const bankName = entry.bankName
                const branchName = entry.branchDesc
                var branchNameLabel = document.createElement("label");
                branchNameLabel.className = "formbold-form-label";
                branchNameLabel.textContent = "Branch Name";
                var branchNameInput = document.createElement("input");
                branchNameInput.className = "formbold-form-input"
                branchNameInput.type = "text";
                branchNameInput.value = branchName;
                branchNameInput.readOnly = true;

                var bankNameLabel = document.createElement("label");
                bankNameLabel.className = "formbold-form-label";
                bankNameLabel.textContent = "Bank Name";
                var bankNameInput = document.createElement("input");
                bankNameInput.type = "text";
                bankNameInput.className = "formbold-form-input"
                bankNameInput.value = bankName;
                bankNameInput.readOnly = true;

                bankNameDiv.appendChild(bankNameLabel)
                bankNameDiv.appendChild(bankNameInput)
                bankNameDiv.classList.remove('d-none')

                branchNameDiv.appendChild(branchNameLabel)
                branchNameDiv.appendChild(branchNameInput)
                branchNameDiv.classList.remove('d-none')
            }

        }
    }

};*/